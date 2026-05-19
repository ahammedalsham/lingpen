import type { Metadata } from "next";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";

export const metadata: Metadata = {
  title: "About | LingPen",
  description:
    "LingPen is building open linguistic research infrastructure for Universal Dependencies and multilingual corpora.",
};

export default function AboutPage() {
  return (
    <MarketingSubPage
      title="About LingPen"
      description="LingPen connects researchers, students, and communities who annotate, publish, and reuse multilingual treebanks and corpora—starting with a strong focus on Indian languages and Universal Dependencies."
    >
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-600 leading-relaxed mb-4">
          The public site you are viewing is the marketing and onboarding surface
          for the platform. Annotation workspaces, dataset hosting, and
          collaboration tools will appear here as the product matures.
        </p>
        <p className="text-slate-600 leading-relaxed">
          For now, create an account to stay aligned with upcoming releases, or
          explore the treebank catalog as it comes online.
        </p>
      </div>
    </MarketingSubPage>
  );
}
