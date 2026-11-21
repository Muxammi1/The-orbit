import { EntryHero } from "@/components/entry/EntryHero";
import { PersonSection } from "@/components/person/PersonSection";
import { WorkSection } from "@/components/work/WorkSection";
import { TwinSection } from "@/components/twin/TwinSection";
import { StackSection } from "@/components/stack/StackSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Divider } from "@/components/ui/Divider";
import {
  getHeroContent,
  getSiteContent,
  getWorkContent,
  getPersonContent,
  getTimelineContent,
  getTwinQuestions,
  getTwinFallbackAnswers,
  getStackContent,
} from "@/lib/content/loaders";

export default function Home() {
  const hero = getHeroContent();
  const site = getSiteContent();
  const work = getWorkContent();
  const person = getPersonContent();
  const timeline = getTimelineContent();
  const twinQuestions = getTwinQuestions();
  const twinFallback = getTwinFallbackAnswers();
  const stack = getStackContent();

  const remainingSections = [
    { id: "research", ring: "RING 06 / RESEARCH", title: "Inquiries at the Physical Boundary", serif: "Boundary" },
    { id: "connect", ring: "RING 07 / CONNECT", title: "Start the Next Question", serif: "Question" },
  ];

  return (
    <main id="main-content" className="shell space-y-24">
      {/* Section 01: Entry (Hero) */}
      <EntryHero hero={hero} site={site} work={work} />

      <Divider ringNumber="RING 02 / PERSON" />

      {/* Section 02: Person */}
      <PersonSection person={person} timeline={timeline} />

      <Divider ringNumber="RING 03 / WORK" />

      {/* Section 03: Work */}
      <WorkSection work={work} />

      <Divider ringNumber="RING 04 / TWIN" />

      {/* Section 04: Twin */}
      <TwinSection
        suggestedQuestions={twinQuestions.questions}
        fallbackData={twinFallback}
        personaName={site.name.split(" ")[0] ?? "Muzammil"}
      />

      <Divider ringNumber="RING 05 / STACK" />

      {/* Section 05: Stack */}
      <StackSection stack={stack} />

      <Divider ringNumber="RING 06 / RESEARCH" />

      {/* Remaining sections */}
      {remainingSections.map((section, idx) => (
        <section
          key={section.id}
          id={section.id}
          data-ring={String(idx + 6).padStart(2, "0")}
          className="min-h-[50vh] flex flex-col justify-center scroll-mt-24 border border-[#252C35]/30 p-8 sm:p-12 rounded-sm bg-[#0E1117]/30"
        >
          <SectionHeader
            ringNumber={section.ring}
            title={section.title}
            serifWord={section.serif}
            subtitle="Section foundation ready for interactive layer integration."
          />
          {idx < remainingSections.length - 1 && (
            <Divider
              ringNumber={`RING ${String(idx + 7).padStart(2, "0")} / ${remainingSections[idx + 1]?.id.toUpperCase()}`}
              className="mt-16 mb-0"
            />
          )}
        </section>
      ))}
    </main>
  );
}
