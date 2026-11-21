import { EntryHero } from "@/components/entry/EntryHero";
import { PersonSection } from "@/components/person/PersonSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Divider } from "@/components/ui/Divider";
import {
  getHeroContent,
  getSiteContent,
  getWorkContent,
  getPersonContent,
  getTimelineContent,
} from "@/lib/content/loaders";

export default function Home() {
  const hero = getHeroContent();
  const site = getSiteContent();
  const work = getWorkContent();
  const person = getPersonContent();
  const timeline = getTimelineContent();

  const remainingSections = [
    { id: "work", ring: "RING 03 / WORK", title: "Architectures of Applied Intelligence", serif: "Applied" },
    { id: "twin", ring: "RING 04 / TWIN", title: "The Digital Counterpart", serif: "Digital" },
    { id: "stack", ring: "RING 05 / STACK", title: "Constellation of Systems", serif: "Systems" },
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

      {/* Remaining sections */}
      {remainingSections.map((section, idx) => (
        <section
          key={section.id}
          id={section.id}
          data-ring={String(idx + 3).padStart(2, "0")}
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
              ringNumber={`RING ${String(idx + 4).padStart(2, "0")} / ${remainingSections[idx + 1]?.id.toUpperCase()}`}
              className="mt-16 mb-0"
            />
          )}
        </section>
      ))}
    </main>
  );
}
