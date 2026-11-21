import Link from "next/link";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-md space-y-6">
        <MonoLabel accent>RING 00 / SYSTEM ERROR</MonoLabel>

        <h1 className="text-5xl sm:text-6xl font-sans font-normal tracking-tight text-[#D9DEE5]">
          404
        </h1>

        <p className="text-sm text-[#8C96A3] leading-relaxed">
          The requested coordinate lies outside ORBIT&rsquo;s defined trajectory. The ring or resource could not be located.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-[#252C35] bg-[#171B22] text-xs font-mono text-[#D9DEE5] hover:border-[#B6E36A]/50 hover:text-[#B6E36A] transition-colors focus-visible:outline-2 focus-visible:outline-[#B6E36A]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
