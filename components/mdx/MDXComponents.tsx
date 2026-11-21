import React from "react";
import { Callout } from "./Callout";
import { DecisionLog } from "./DecisionLog";
import { Figure } from "./Figure";
import { CodeBlock } from "./CodeBlock";

export const mdxComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-3xl sm:text-4xl font-sans font-normal tracking-tight text-[#D9DEE5] mt-12 mb-6"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-2xl sm:text-3xl font-sans font-normal tracking-tight text-[#D9DEE5] mt-10 mb-4 border-b border-[#252C35] pb-2"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="text-xl font-sans font-medium text-[#D9DEE5] mt-8 mb-3"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="text-base text-[#8C96A3] leading-relaxed mb-4"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside space-y-2 text-[#8C96A3] mb-6 pl-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside space-y-2 text-[#8C96A3] mb-6 pl-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-[#8C96A3] leading-relaxed" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-2 border-[#B6E36A] pl-4 italic text-[#D9DEE5]/90 my-6 bg-[#171B22]/30 py-2 rounded-r-sm"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code
          className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#171B22] border border-[#252C35] text-[#B6E36A]"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: CodeBlock,
  Callout,
  DecisionLog,
  Figure,
};
