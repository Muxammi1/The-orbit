import { EntryHero } from "@/components/entry/EntryHero";
import { PersonSection } from "@/components/person/PersonSection";
import { WorkSection } from "@/components/work/WorkSection";
import { TwinSection } from "@/components/twin/TwinSection";
import { StackSection } from "@/components/stack/StackSection";
import { ResearchSection } from "@/components/research/ResearchSection";
import { ConnectSection } from "@/components/connect/ConnectSection";
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
  getResearchContent,
  getConnectContent,
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
  const research = getResearchContent();
  const connect = getConnectContent();

  return (
    <main id="main-content" className="shell space-y-28 sm:space-y-36">
      {/* Section 01: Entry (Hero) */}
      <EntryHero hero={hero} site={site} work={work} />

      <Divider />

      {/* Section 02: Person */}
      <PersonSection person={person} timeline={timeline} />

      <Divider />

      {/* Section 03: Work */}
      <WorkSection work={work} />

      <Divider />

      {/* Section 04: Twin */}
      <TwinSection
        suggestedQuestions={twinQuestions.questions}
        fallbackData={twinFallback}
        personaName={site.name.split(" ")[0] ?? "Muzammil"}
      />

      <Divider />

      {/* Section 05: Stack */}
      <StackSection stack={stack} />

      <Divider />

      {/* Section 06: Research */}
      <ResearchSection research={research} />

      <Divider />

      {/* Section 07: Connect */}
      <ConnectSection
        connect={connect}
        showAvailabilityStatus={site.featureFlags.showAvailabilityStatus}
      />
    </main>
  );
}
