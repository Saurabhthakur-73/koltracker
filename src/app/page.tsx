"use client";

import { useEffect, useState } from "react";

export default function Home() {
  
  const [kols, setKols] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [minAccuracy, setMinAccuracy] = useState(0);
  const [error, setError] = useState("");
  const [signals, setSignals] = useState<any[]>([]);
  const [selectedKol, setSelectedKol] = useState<any>(null);

  useEffect(() => {
  fetch(
    "https://gist.githubusercontent.com/Sandeepsorout01/4fef48fa4ddaa7551ad9fdeb5a0087e1/raw/kols.json"
  )
    .then((res) => res.json())
    .then((data) => {
      setKols(data);
      setLoading(false);
    })
    .catch(() => {
      setError("Failed to load data");
      setLoading(false);
    });

  fetch(
    "https://gist.githubusercontent.com/Sandeepsorout01/4fef48fa4ddaa7551ad9fdeb5a0087e1/raw/signals.json"
  )
    .then((res) => res.json())
    .then((data) => {
      setSignals(data);
    });

}, []);

  const filteredKols = kols.filter(
  (kol) =>
    kol.handle.toLowerCase().includes(search.toLowerCase()) &&
    kol.accuracy_pct >= minAccuracy
  );

  const kolSignals = selectedKol
  ? signals.filter(
      (signal) => signal.kol_id === selectedKol.id
    )
  : [];

  if (loading) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      Loading...
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-4">
      <p>{error}</p>

      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-600 rounded"
      >
        Retry
      </button>
    </div>
  );
}

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              KOL Audit Dashboard
            </h1>

            <p className="text-zinc-400 mt-2">
              Track influencer performance and signal history
            </p>

            <div className="mt-4 space-y-1">
              <p>Total KOLs: {filteredKols.length}</p>
              <p>
                Last Updated: {new Date().toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 md:mt-0 px-4 py-2 bg-white text-black rounded-lg"
          >
            Refresh
          </button>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search KOL handle..."
          className="w-full max-w-md px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white mb-6"
        />

        <div className="my-4">
          <input
            type="number"
            placeholder="Minimum Accuracy %"
            value={minAccuracy}
            onChange={(e) => setMinAccuracy(Number(e.target.value))}
            className="w-full max-w-md px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white"
          />
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() =>
              setKols([...kols].sort((a, b) => b.accuracy_pct - a.accuracy_pct))
            }
            className="px-4 py-2 bg-zinc-800 rounded"
          >
            Accuracy
          </button>

          <button
            onClick={() =>
              setKols([...kols].sort((a, b) => b.avg_roi_pct - a.avg_roi_pct))
            }
            className="px-4 py-2 bg-zinc-800 rounded"
          >
            ROI
          </button>

          <button
            onClick={() =>
              setKols([...kols].sort((a, b) => b.total_signals - a.total_signals))
            }
            className="px-4 py-2 bg-zinc-800 rounded"
          >
            Signals
          </button>
        </div>


        {filteredKols.length === 0 && (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold">
              No KOLs Found
            </h2>
          </div>
        )}
        {filteredKols.slice(0, 50).map((kol, index) => (
          <div
            key={kol.id}
            className="border-b border-zinc-800 py-4 flex justify-between items-center"
          >
            <div className=" text-zinc-400 font-bold">
               #{index + 1}
            </div>
            
            <div className="flex items-center gap-3">
              <img
                src={kol.avatar}
                alt={kol.handle}
                className="w-12 h-12 rounded-full"
              />

              <div>
                <p className="font-semibold">{kol.handle}</p>
                <p className="text-sm text-zinc-400">{kol.name}</p>
              </div>
            </div>

            <div className="text-right">
              <p>Accuracy: {kol.accuracy_pct}%</p>
              <p>ROI: {kol.avg_roi_pct}%</p>
              <p>Signals: {kol.total_signals}</p>

              <button
                onClick={() => setSelectedKol(kol)}
                className="mt-2 px-3 py-1 bg-blue-600 rounded"
              >
                View Signals
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedKol && (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl w-[600px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {selectedKol.handle}
        </h2>

        <div className="space-y-2">
          <p>Name: {selectedKol.name}</p>
          <p>Accuracy: {selectedKol.accuracy_pct}%</p>
          <p>ROI: {selectedKol.avg_roi_pct}%</p>
          <p>Total Signals: {selectedKol.total_signals}</p>
        </div>

        <div className="mt-6">
          <h3 className="font-bold mb-3">
            Recent Signals ({kolSignals.length})
          </h3>

          {kolSignals.slice(0, 10).map((signal, index) => (
            <div
              key={signal.id}
              className="border-b border-zinc-700 py-3"
            >
              <p>Symbol: {signal.symbol}</p>
              <p>Direction: {signal.direction}</p>
              <p>Status: {signal.status}</p>
              <p>Entry: {signal.entry_price}</p>
              <p>Target: {signal.target_price}</p>
              <p>SL: {signal.stop_loss}</p>
              <p>ROI: {signal.roi_pct}%</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setSelectedKol(null)}
          className="mt-6 px-4 py-2 bg-red-600 rounded"
        >
          Close
        </button>
        </div>
      </div>
  )}
  </main>
  );
}