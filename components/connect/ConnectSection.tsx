import { SectionHeader } from "@/components/ui/SectionHeader";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { ContactForm } from "./ContactForm";
import { DirectLinks } from "./DirectLinks";
import type { ConnectContent } from "@/lib/content/schemas";

interface ConnectSectionProps {
  connect: ConnectContent;
  showAvailabilityStatus?: boolean;
}

export function ConnectSection({
  connect,
  showAvailabilityStatus = false,
}: ConnectSectionProps) {
  return (
    <section
      id="connect"
      data-ring="07"
      className="scroll-mt-24 min-h-screen py-24 space-y-16"
      aria-labelledby="connect-heading"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#252C35]/50 pb-8">
        <SectionHeader
          ringNumber="RING 07 / CONNECT"
          title="Start the Next Question"
          serifWord="Question"
          subtitle={connect.subheadline}
          id="connect-heading"
        />

        {showAvailabilityStatus && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B6E36A]/30 bg-[#171B22]">
            <span className="w-2 h-2 rounded-full bg-[#B6E36A] animate-pulse" />
            <span className="text-xs font-mono text-[#D9DEE5]">
              AVAILABLE FOR COLLABORATION
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Context, Direct Links, and Convergence Metaphor */}
        <div className="space-y-10">
          <div className="space-y-4">
            <MonoLabel accent>CONVERGENCE</MonoLabel>
            <h3 className="text-2xl sm:text-3xl font-sans text-[#D9DEE5] leading-snug font-normal">
              {connect.headline}
            </h3>
            <p className="text-sm text-[#8C96A3] leading-relaxed max-w-lg">
              At Ring 07, the orbital rings converge into alignment. Whether you are interested in deploying edge perception models, discussing verifiable intelligence architectures, or initiating graduate research inquiries, all channels below reach Muzammil directly.
            </p>
          </div>

          {/* Direct Channels */}
          <DirectLinks links={connect.directLinks} />
        </div>

        {/* Right Column: Secure Form */}
        <div>
          <ContactForm reasons={connect.reasons} />
        </div>
      </div>
    </section>
  );
}
