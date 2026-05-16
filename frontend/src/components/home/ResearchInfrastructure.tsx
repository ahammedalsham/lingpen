export default function ResearchInfrastructure() {
  return (
      <section className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Research-grade. Not just annotation-grade.</h2>
            <p className="text-neutral-600 mb-8">
              Built-in version control, reproducibility packages, and deep agreement metrics elevate LingPen from an editor to a research environment.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start"><span className="text-indigo-primary mr-2">✓</span> Version Control for Treebanks</li>
              <li className="flex items-start"><span className="text-indigo-primary mr-2">✓</span> Reproducibility Packages</li>
              <li className="flex items-start"><span className="text-indigo-primary mr-2">✓</span> Agreement Analytics</li>
            </ul>
          </div>
          <div className="h-80 bg-neutral-100 rounded-xl border border-neutral-200 flex items-center justify-center">
            <span className="text-neutral-400">[Annotation Diff Viewer Illustration]</span>
          </div>
        </div>
      </section>
  );
}