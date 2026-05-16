export default function StatsStrip() {
  return (
      <section className="py-16 bg-indigo-primary text-white border-y border-indigo-dark">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          <div><div className="text-4xl font-bold">12+</div><div className="text-indigo-200 text-sm mt-2">Languages</div></div>
          <div><div className="text-4xl font-bold">25k+</div><div className="text-indigo-200 text-sm mt-2">Sentences</div></div>
          <div><div className="text-4xl font-bold">150+</div><div className="text-indigo-200 text-sm mt-2">Contributors</div></div>
          <div><div className="text-4xl font-bold">20+</div><div className="text-indigo-200 text-sm mt-2">Active Projects</div></div>
          <div><div className="text-4xl font-bold">8</div><div className="text-indigo-200 text-sm mt-2">Published</div></div>
        </div>
      </section>
  );
}