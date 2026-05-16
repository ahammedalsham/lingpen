export default function FeaturedTreebank() {
  return (
      <section className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">Open treebanks, freely available</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-indigo-dark">Malayalam UD v2.1</h3>
                  <span className="bg-neutral-100 text-neutral-600 text-xs px-2 py-1 rounded">CC BY-SA</span>
                </div>
                <p className="text-sm text-neutral-600 mb-4">Comprehensive dependency treebank for modern Malayalam literature and news.</p>
                <div className="flex space-x-4 text-xs text-neutral-500 mb-6">
                  <span>4,500 sentences</span>
                  <span>12 contributors</span>
                </div>
                <button className="text-indigo-primary font-medium text-sm hover:underline">Browse Treebank →</button>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
}