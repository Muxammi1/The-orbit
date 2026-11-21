"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ChatInterface } from "./ChatInterface";
import { Stage } from "@/components/stage/Stage";
import { AvatarScene, type TwinVisualState } from "@/scenes/avatar/AvatarScene";

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
  const [twinState, setTwinState] = useState<TwinVisualState>("idle");

  const stateLabels: Record<TwinVisualState, string> = {
    idle: "IDLE // SCANNING GAZE",
    listening: "LISTENING // INPUT SENSORS ACTIVE",
    thinking: "THINKING // COMPUTING VECTORS",
    speaking: "TRANSMITTING // SPEECH SYNTHESIS",
  };

  return (
    <section
      id="twin"
      data-ring="04"
      className="scroll-mt-24 min-h-screen flex flex-col justify-center py-20"
      aria-labelledby="twin-heading"
    >
      <SectionHeader
        ringNumber="THE DIGITAL TWIN"
        title="The Robotic Counterpart"
        subtitle="A dedicated 3D intelligence terminal grounded exclusively in verified architectural, research, and technical knowledge."
        id="twin-heading"
        className="mb-12"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left / Dominant: 3D Viewport of Humanoid Robotic Counterpart */}
        <div className="lg:col-span-6 flex flex-col justify-between border border-[#252C35] rounded-sm bg-[#0E1117]/80 overflow-hidden shadow-2xl relative min-h-[460px] lg:min-h-[580px]">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#252C35] bg-[#08090C]/60 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B6E36A] animate-pulse shadow-[0_0_8px_#B6E36A]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#D9DEE5] font-medium">
                {`${personaName.toUpperCase()} // CYBERNETIC AVATAR`}
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#B6E36A] px-2 py-0.5 rounded bg-[#171B22] border border-[#252C35]">
              {stateLabels[twinState]}
            </span>
          </div>

          {/* 3D Scene Stage */}
          <div className="relative flex-1 w-full h-full min-h-[380px]">
            <Stage
              camera={{ position: [0, 0.4, 3.6], fov: 36 }}
              className="w-full h-full"
            >
              <AvatarScene twinState={twinState} />
            </Stage>
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="flex flex-wrap items-center justify-between px-5 py-2.5 border-t border-[#252C35] bg-[#08090C]/80 font-mono text-[10px] text-[#8C96A3] z-10">
            <span>CHASSIS: TITANIUM / OBSIDIAN</span>
            <span>ENERGY CORE: ION GREEN 520NM</span>
            <span>STATUS: ACTIVE</span>
          </div>
        </div>

        {/* Right: Scientific Research Console Interface */}
        <div className="lg:col-span-6 flex flex-col justify-between border border-[#252C35] rounded-sm p-6 sm:p-8 bg-[#0E1117]/90 shadow-2xl">
          <ChatInterface
            questions={suggestedQuestions}
            fallbackData={fallbackData}
            personaName={personaName}
            onStateChange={setTwinState}
          />
        </div>
      </div>
    </section>
  );
}
