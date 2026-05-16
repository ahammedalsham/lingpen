export default function CommunitySection() {
  return (
      <section className="py-24 bg-neutral-50 px-6 border-y border-neutral-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-3 space-y-4">
            <div className="h-24 bg-white rounded-lg shadow-sm border border-neutral-200 flex items-center p-4">
              [Contributor Profile Mockup]
            </div>
            <div className="h-32 bg-white rounded-lg shadow-sm border border-neutral-200 flex items-center p-4">
              [Review Comment Thread Mockup]
            </div>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Annotation is more collaborative than it looks.</h2>
            <p className="text-neutral-600 mb-8">
              Turn isolated annotation projects into connected research communities. Discuss syntax, review decisions, and build datasets together.
            </p>
          </div>
        </div>
      </section>
  );
}