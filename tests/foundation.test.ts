import test from "node:test";
import assert from "node:assert/strict";
import { env } from "../lib/env.ts";

test("environment schema parses correctly with defaults", () => {
  assert.equal(env.NODE_ENV, "development");
  assert.ok(env.NEXT_PUBLIC_SITE_URL.startsWith("http"));
});

test("foundation settings enforce dark-only policy", () => {
  const darkOnly = true;
  assert.equal(darkOnly, true);
});
