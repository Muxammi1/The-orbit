import { SectionHeader } from "@/components/ui/SectionHeader";
import { PortraitFrame } from "./PortraitFrame";
import { StorySlider } from "./StorySlider";
import { OrbitalTimeline } from "./OrbitalTimeline";
import type { PersonContent, TimelineContent } from "@/lib/content/schemas";

export interface PersonSectionProps {
  person: PersonContent;
  timeline: TimelineContent;
}

export function PersonSection({ person, timeline }: PersonSectionProps) {
  return (
    <section
      id="person"
      data-ring="02"
      aria-label="Section 02: Person"
      className="space-y-16 scroll-mt-24"
    >
      <SectionHeader
        ringNumber="RING 02 / PERSON"
        title="Curiosity, Engineering, Research"
        serifWord="Research"
        subtitle={person.statement}
      />

      {/* Split screen: Left portrait frame, Right storytelling slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 flex items-center justify-center">
          <PortraitFrame alt="Muzammil Yasir — Systems Thinker" />
        </div>
        <div className="lg:col-span-7">
          <StorySlider chapters={person.chapters} />
        </div>
      </div>

      {/* Orbital Path Timeline below */}
      <OrbitalTimeline milestones={timeline.milestones} />
    </section>
  );
}
