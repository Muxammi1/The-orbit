import {
  Mail,
  FileText,
  Sparkles,
  Briefcase,
  ArrowUpRight,
} from "lucide-react";

interface DirectLink {
  label: string;
  href: string;
  type: string;
}

interface DirectLinksProps {
  links: DirectLink[];
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export function DirectLinks({ links }: DirectLinksProps) {
  const getIcon = (label: string, type: string) => {
    const l = label.toLowerCase();
    if (l.includes("github")) return <GithubIcon className="h-4 w-4" />;
    if (l.includes("linkedin")) return <LinkedinIcon className="h-4 w-4" />;
    switch (type) {
      case "contact":
        return <Mail className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "collaboration":
        return <Sparkles className="h-4 w-4" />;
      case "opportunity":
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-3">
      <span className="text-xs font-mono uppercase tracking-widest text-[#8C96A3] block">
        DIRECT CHANNELS &amp; VERIFIED PROFILES
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link) => {
          const isExternal =
            link.href.startsWith("http") || link.href.startsWith("mailto:");

          return (
            <a
              key={link.label}
              href={link.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={[
                "group flex items-center justify-between p-3.5 rounded-sm border border-[#252C35] bg-[#0E1117]/60",
                "hover:border-[#B6E36A]/50 hover:bg-[#171B22]/60 transition-all",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6E36A]",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span className="text-[#8C96A3] group-hover:text-[#B6E36A] transition-colors">
                  {getIcon(link.label, link.type)}
                </span>
                <span className="text-xs font-mono text-[#D9DEE5] group-hover:text-[#B6E36A] transition-colors">
                  {link.label}
                </span>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#8C96A3] group-hover:text-[#B6E36A] transition-colors" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
