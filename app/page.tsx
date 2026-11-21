import { SectionHeader } from "@/components/ui/SectionHeader";
import { Divider } from "@/components/ui/Divider";

export default function Home() {
  const sections = [
    { id: "entry", ring: "RING 01 / ENTRY", title: "An Exploration of Intelligence", serif: "Intelligence" },
    { id: "person", ring: "RING 02 / PERSON", title: "Curiosity, Engineering, Research", serif: "Research" },
    { id: "work", ring: "RING 03 / WORK", title: "Architectures of Applied Intelligence", serif: "Applied" },
    { id: "twin", ring: "RING 04 / TWIN", title: "The Digital Counterpart", serif: "Digital" },
    { id: "stack", ring: "RING 05 / STACK", title: "Constellation of Systems", serif: "Systems" },
    { id: "research", ring: "RING 06 / RESEARCH", title: "Inquiries at the Physical Boundary", serif: "Boundary" },
    { id: "connect", ring: "RING 07 / CONNECT", title: "Start the Next Question", serif: "Question" },
  ];

  return (
    <main id="main-content" className="shell pt-32 pb-40 space-y-32">
      {sections.map((section, idx) => (
        <section
          key={section.id}
          id={section.id}
          data-ring={String(idx + 1).padStart(2, "0")}
          className="min-h-[50vh] flex flex-col justify-center scroll-mt-24 border border-[#252C35]/30 p-8 sm:p-12 rounded-sm bg-[#0E1117]/30"
        >
          <SectionHeader
            ringNumber={section.ring}
            title={section.title}
            serifWord={section.serif}
            subtitle="Section foundation ready for interactive layer integration."
          />
          {idx < sections.length - 1 && <Divider className="mt-16 mb-0" />}
        </section>
      ))}
    </main>
  );
}
