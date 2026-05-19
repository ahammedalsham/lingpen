import type { Metadata } from "next";
import Link from "next/link";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Treebanks | LingPen",
  description:
    "Browse Universal Dependencies treebanks and multilingual corpora on LingPen.",
};

export default function TreebanksPage() {
  return (
    <MarketingSubPage
      title="Treebanks"
      description="A public catalog of Universal Dependencies resources will live here, with filters by language, genre, and release."
    >
      <p className="text-slate-600 leading-relaxed mb-8">
        The full catalog UI is under construction. When authenticated workflows
        ship, you will also manage private and in-progress treebanks from the
        dashboard.
      </p>
      <Link
        href={ROUTES.REGISTER}
        className="inline-flex items-center justify-center rounded-lg bg-indigo-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-dark transition-colors"
      >
        Get notified when the catalog launches
      </Link>
    </MarketingSubPage>
  );
}
