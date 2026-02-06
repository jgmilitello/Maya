export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-10">
      <h1 className="text-4xl font-bold mb-4">
        📈 Finance for Normal People
      </h1>

      <p className="text-gray-300 max-w-xl">
        Enter a stock ticker and get a plain-English explanation of what’s
        actually going on. No finance background required.
      </p>

      <div className="mt-8 flex gap-4">
        <input
          placeholder="Try AAPL, TSLA, NVDA"
          className="px-4 py-2 rounded text-black w-64"
        />
        <button className="bg-green-600 px-4 py-2 rounded font-semibold">
          Explain
        </button>
      </div>
    </main>
  );
}
