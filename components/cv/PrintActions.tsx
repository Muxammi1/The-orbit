"use client";

import { Printer, Download } from "lucide-react";

interface PrintActionsProps {
  cvFilePath: string;
}

export function PrintActions({ cvFilePath }: PrintActionsProps) {
  return (
    <div className="flex items-center gap-3 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm border border-[#252C35] bg-[#171B22] text-xs font-mono text-[#D9DEE5] hover:border-[#B6E36A]/50 hover:text-[#B6E36A] transition-colors focus-visible:outline-2 focus-visible:outline-[#B6E36A]"
      >
        <Printer className="h-4 w-4" />
        <span>Print Document</span>
      </button>

      <a
        href={cvFilePath}
        download
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm border border-[#B6E36A]/40 bg-[#B6E36A] text-xs font-mono text-[#08090C] font-semibold hover:bg-[#a5d655] transition-colors focus-visible:outline-2 focus-visible:outline-[#B6E36A]"
      >
        <Download className="h-4 w-4" />
        <span>Download PDF</span>
      </a>
    </div>
  );
}
