import React from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      target,
      rel,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6E36A]";

    const sizeStyles = {
      sm: "text-[11px] px-3.5 py-1.5 rounded-sm gap-1.5",
      md: "text-xs px-5 py-2.5 rounded-sm gap-2",
      lg: "text-sm px-7 py-3.5 rounded-sm gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-[#B6E36A] text-[#08090C] font-semibold hover:bg-[#cbf489] active:bg-[#a5cf5d] shadow-[0_0_20px_rgba(182,227,106,0.15)]",
      secondary:
        "bg-[#171B22] text-[#D9DEE5] border border-[#252C35] hover:border-[#8C96A3] hover:text-white active:bg-[#0E1117]",
      ghost:
        "bg-transparent text-[#8C96A3] hover:text-[#D9DEE5] hover:bg-[#171B22]/50 active:bg-[#171B22]",
    };

    const classes = cn(baseStyles, sizeStyles[size], variantStyles[variant], className);

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
          aria-disabled={disabled}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
