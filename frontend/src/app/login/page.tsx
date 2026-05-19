import type { Metadata } from "next";
import Link from "next/link";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Sign in | LingPen",
  description: "Sign in to LingPen to annotate, collaborate, and manage corpora.",
};

export default function LoginPage() {
  return (
    <MarketingSubPage
      title="Sign in"
      description="Authentication is not wired to the backend UI on this preview yet. Use registration to reserve your path into the workspace."
    >
      <p className="text-slate-600 mb-6">
        Need an account?{" "}
        <Link
          href={ROUTES.REGISTER}
          className="font-semibold text-indigo-primary hover:underline"
        >
          Create one
        </Link>
        .
      </p>
    </MarketingSubPage>
  );
}
