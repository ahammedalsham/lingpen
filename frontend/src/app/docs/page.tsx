import type { Metadata } from "next";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";

export const metadata: Metadata = {
  title: "Documentation | LingPen",
  description: "LingPen API and platform documentation.",
};

export default function DocsPage() {
  return (
    <MarketingSubPage
      title="Documentation"
      description="OpenAPI descriptions, authentication flows, and corpus formats will be published here alongside the backend release cadence."
    >
      <p className="text-slate-600 leading-relaxed">
        Until the reference is live, follow repository README files for local
        development and reach out via the contact channels listed in the site
        footer once those pages are published.
      </p>
    </MarketingSubPage>
  );
}
