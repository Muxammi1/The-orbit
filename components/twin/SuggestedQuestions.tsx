"use client";

interface Question {
  id: string;
  label: string;
  prompt: string;
}

interface SuggestedQuestionsProps {
  questions: Question[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function SuggestedQuestions({
  questions,
  onSelect,
  disabled = false,
}: SuggestedQuestionsProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Suggested questions"
    >
      {questions.map((q) => (
        <button
          key={q.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(q.prompt)}
          className={[
            "px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest",
            "border border-[#252C35] rounded-sm",
            "text-[#8C96A3] hover:text-[#D9DEE5] hover:border-[#B6E36A]/50",
            "transition-colors duration-200",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6E36A]",
          ].join(" ")}
        >
          {q.label}
        </button>
      ))}
    </div>
  );
}
