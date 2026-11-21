import { SectionHeader } from "@/components/ui/SectionHeader";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { ChatInterface } from "./ChatInterface";

interface Question {
  id: string;
  label: string;
  prompt: string;
}

interface FallbackAnswer {
  id: string;
  answer: string;
  sources: string[];
}

interface FallbackData {
  answers: Record<string, FallbackAnswer>;
  defaultFallback: { answer: string; sources: string[] };
}

interface TwinSectionProps {
  suggestedQuestions: Question[];
  fallbackData: FallbackData;
  personaName?: string;
}

export function TwinSection({
  suggestedQuestions,
  fallbackData,
  personaName = "Muzammil",
}: TwinSectionProps) {
  return (
    <section
      id="twin"
      data-ring="04"
      className="scroll-mt-24 min-h-screen flex flex-col justify-center py-24"
      aria-labelledby="twin-heading"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left: Editorial framing */}
        <div className="flex flex-col gap-8">
          <SectionHeader
            ringNumber="RING 04 / TWIN"
            title="The Digital Counterpart"
            serifWord="Digital"
            subtitle="A constrained language interface built on verified content only. It does not guess, invent, or speculate."
            id="twin-heading"
          />

          <div className="space-y-5 text-[#8C96A3] text-sm leading-relaxed max-w-sm">
            <p>
              This interface speaks in third person. It draws solely from
              Muzammil&rsquo;s documented work, research statements, and
              curated knowledge — nothing fabricated, nothing improvised.
            </p>
            <p>
              When a question falls outside the knowledge base, it says so and
              routes you to the Connect section for a direct reply.
            </p>
          </div>

          {/* System constraints */}
          <div className="border border-[#252C35] rounded-sm p-5 space-y-2">
            <MonoLabel className="text-[#B6E36A] mb-3 block">
              SYSTEM CONSTRAINTS
            </MonoLabel>
            {[
              "Third-person responses only",
              "No invented metrics or dates",
              "Sources cited per response",
              "Offline fallback always available",
              "Cloudflare Turnstile verification",
            ].map((rule) => (
              <div key={rule} className="flex items-center gap-2 text-xs">
                <span className="w-1 h-1 rounded-full bg-[#B6E36A] flex-shrink-0" />
                <span className="text-[#8C96A3]">{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chat interface */}
        <div className="border border-[#252C35] rounded-sm p-6 sm:p-8 bg-[#0E1117]/60">
          <ChatInterface
            questions={suggestedQuestions}
            fallbackData={fallbackData}
            personaName={personaName}
          />
        </div>
      </div>
    </section>
  );
}
