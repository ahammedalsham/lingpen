import type { Metadata } from "next";
import Link from "next/link";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Create account | LingPen",
  description: "Join LingPen to collaborate on multilingual linguistic resources.",
};

export default function RegisterPage() {
  return (
    <MarketingSubPage
      title="Create your LingPen account"
      description="We will connect this form to the FastAPI backend as auth endpoints stabilize. For now, this page anchors the primary call-to-action from the landing experience."
    >
      <p className="text-slate-600 mb-8">
        Already have access?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-semibold text-indigo-primary hover:underline"
        >
          Sign in
        </Link>
        .
      </p>
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500">
          Registration form placeholder — hook up{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">
            /api/v1/auth
          </code>{" "}
          when ready.
        </p>
      </div>
    </MarketingSubPage>
  );
}
