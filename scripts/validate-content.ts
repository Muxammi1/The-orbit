/**
 * Full content validation script.
 * Validates all /content JSON and MDX frontmatter against Zod schemas.
 * Audits all placeholders.
 * Flags: --strict (fails with exit code 1 if any placeholder remains).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  siteSchema,
  navigationSchema,
  heroSchema,
  personSchema,
  timelineSchema,
  workSchema,
  caseStudyFrontmatterSchema,
  stackSchema,
  researchSchema,
  researchEntryFrontmatterSchema,
  connectSchema,
  mediaSchema,
  suggestedQuestionsSchema,
  fallbackAnswersSchema,
} from "../lib/content/schemas.ts";

const isStrict = process.argv.includes("--strict");
const contentDir = path.resolve(process.cwd(), "content");

interface PlaceholderRecord {
  file: string;
  fieldOrLine: string;
  value: string;
}

const placeholders: PlaceholderRecord[] = [];
let hasSchemaError = false;

function scanForPlaceholders(obj: unknown, file: string, pathPrefix = ""): void {
  if (typeof obj === "string") {
    if (obj.includes("[Placeholder:") || obj.includes("[Placeholder]")) {
      placeholders.push({ file, fieldOrLine: pathPrefix || "text", value: obj });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      scanForPlaceholders(item, file, `${pathPrefix}[${index}]`);
    });
  } else if (obj !== null && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      if (key === "status" && value === "placeholder") {
        placeholders.push({ file, fieldOrLine: `${pathPrefix}.${key}`, value: String(value) });
      }
      scanForPlaceholders(value, file, pathPrefix ? `${pathPrefix}.${key}` : key);
    }
  }
}

function validateJson<T>(
  relativePath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: any } }
): void {
  const filePath = path.join(contentDir, relativePath);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: ${relativePath}`);
    hasSchemaError = true;
    return;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(raw);
    const result = schema.safeParse(json);

    if (!result.success) {
      console.error(`❌ Validation failed for ${relativePath}:`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.error.issues.forEach((issue: any) => {
        console.error(`   - [${issue.path.join(".")}] ${issue.message}`);
      });
      hasSchemaError = true;
    } else {
      scanForPlaceholders(json, relativePath);
      console.log(`✅ Validated: ${relativePath}`);
    }
  } catch (err) {
    console.error(`❌ Failed to parse ${relativePath}:`, err);
    hasSchemaError = true;
  }
}

function validateMdxDirectory(
  subDir: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: { safeParse: (data: unknown) => { success: boolean; data?: unknown; error?: any } }
): void {
  const dirPath = path.join(contentDir, subDir);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    const relativePath = path.join(subDir, file);
    const fullPath = path.join(dirPath, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const parsed = matter(raw);

    const result = schema.safeParse(parsed.data);
    if (!result.success) {
      console.error(`❌ Frontmatter validation failed for ${relativePath}:`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.error.issues.forEach((issue: any) => {
        console.error(`   - [${issue.path.join(".")}] ${issue.message}`);
      });
      hasSchemaError = true;
    } else {
      scanForPlaceholders(parsed.data, relativePath, "frontmatter");
      scanForPlaceholders(parsed.content, relativePath, "body");
      console.log(`✅ Validated MDX: ${relativePath}`);
    }
  }
}

console.log(`\n🔍 Validating ORBIT content system (strict mode: ${isStrict ? "ON" : "OFF"})...\n`);

validateJson("site.json", siteSchema);
validateJson("navigation.json", navigationSchema);
validateJson("hero.json", heroSchema);
validateJson("person.json", personSchema);
validateJson("timeline.json", timelineSchema);
validateJson("work.json", workSchema);
validateJson("stack.json", stackSchema);
validateJson("research.json", researchSchema);
validateJson("connect.json", connectSchema);
validateJson("media.json", mediaSchema);
validateJson("twin/suggested-questions.json", suggestedQuestionsSchema);
validateJson("twin/fallback-answers.json", fallbackAnswersSchema);

validateMdxDirectory("work", caseStudyFrontmatterSchema);
validateMdxDirectory("research", researchEntryFrontmatterSchema);

console.log("\n--------------------------------------------------");
console.log(`📊 Audit Summary: ${placeholders.length} placeholders identified across content files.`);
console.log("--------------------------------------------------");

if (placeholders.length > 0) {
  console.log("\n⚠️  Identified Placeholders:");
  placeholders.forEach((p, idx) => {
    console.log(`  ${idx + 1}. [${p.file}] ${p.fieldOrLine} -> ${p.value.substring(0, 60)}${p.value.length > 60 ? "..." : ""}`);
  });
}

if (hasSchemaError) {
  console.error("\n❌ Content validation failed due to schema violations.");
  process.exit(1);
}

if (isStrict && placeholders.length > 0) {
  console.error(`\n❌ STRICT CHECK FAILED: Found ${placeholders.length} placeholder(s). All placeholders must be replaced before production launch.\n`);
  process.exit(1);
}

console.log("\n✅ Content validation passed successfully.\n");
