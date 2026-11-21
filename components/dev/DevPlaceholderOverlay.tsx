"use client";

export function DevPlaceholderOverlay() {
  const showPlaceholders = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "true";
  if (!showPlaceholders) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-50 bg-[#171B22]/95 border border-amber-400/50 rounded-sm px-3 py-2 text-[11px] font-mono text-amber-300 shadow-xl flex items-center gap-2 backdrop-blur-md"
    >
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      <span>DEV OVERLAY: PLACEHOLDERS ACTIVE</span>
    </div>
  );
}
