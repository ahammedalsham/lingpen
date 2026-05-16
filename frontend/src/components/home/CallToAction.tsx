export default function CallToAction() {
  return (
      <section className="py-24 bg-amber px-6 text-center text-indigo-dark">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Help build open linguistic resources for India</h2>
          <p className="text-xl mb-12 opacity-90">Whether you&apos;re a researcher, student, native speaker, or developer—there&apos;s a place for you.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <button className="bg-indigo-dark text-white py-4 px-6 rounded-lg font-bold hover:bg-neutral-900 transition-colors">Start a Project</button>
            <button className="bg-white text-indigo-dark py-4 px-6 rounded-lg font-bold hover:bg-neutral-50 transition-colors">Start Learning</button>
            <button className="bg-transparent border-2 border-indigo-dark text-indigo-dark py-4 px-6 rounded-lg font-bold hover:bg-indigo-dark hover:text-white transition-colors">Explore API</button>
          </div>
        </div>
      </section>
  );
}