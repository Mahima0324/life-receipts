import { useMemo, useState } from "react";
import "./App.css";
import spotifyData from "./data/spotify_history.csv?raw";
import Papa from "papaparse";

const spotifyRecords = Papa.parse(spotifyData, {
  header: true,
  skipEmptyLines: true,
}).data;

const lateNightRecords = spotifyRecords.filter((item) => {
  if (!item.ts) return false;

  const hour = new Date(item.ts).getHours();

  return hour >= 0 && hour < 5;
});

console.log("Total Spotify records:", spotifyRecords.length);
console.log("Late night records:", lateNightRecords.length);

const artistCounts = {};

spotifyRecords.forEach((record) => {
  const artist = record.artist_name;

  if (artist) {
    artistCounts[artist] = (artistCounts[artist] || 0) + 1;
  }
});

const topArtists = Object.entries(artistCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

console.log("Top artists:", topArtists);

const receipts = spotifyRecords.slice(0, 50).map((record, index) => ({
  id: index + 1,
  type: "Music",
  icon: "♫",
  title: record.track_name || "Unknown song",
  description: `${record.artist_name || "Unknown artist"} • ${record.album_name || "Unknown album"}`,
  date: record.ts ? record.ts.split(" ")[0] : "",
  time: record.ts ? record.ts.split(" ")[1] : "",
  place: record.platform || "Spotify",
}));

const filters = [
  "All",
  "Music",
  "Movie",
  "Place",
  "Purchase",
  "Photo",
  "Note",
];

function App() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const lateNightCount = lateNightRecords.length;

const insightText = `You listened to music ${lateNightCount.toLocaleString()} times between midnight and 5 AM.`;
const topArtist = topArtists[0]?.[0] || "Unknown artist";
const topArtistCount = topArtists[0]?.[1] || 0;

  const filteredReceipts = useMemo(() => {
  return receipts.filter((receipt) => {
    const matchesFilter =
      activeFilter === "All" ||
      receipt.type?.toLowerCase() === activeFilter.toLowerCase();

    const searchText = search.toLowerCase();

    const matchesSearch =
      !searchText ||
      receipt.title?.toLowerCase().includes(searchText) ||
      receipt.description?.toLowerCase().includes(searchText) ||
      receipt.place?.toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });
}, [activeFilter, search]);

  return (
    <main className="app">
    <section className="insight-card">
  <div className="insight-label">✦ DISCOVERED PATTERN</div>

  <h2>The After-Hours Chapter</h2>

  <p>{insightText}</p>

  <div className="artist-insight">
  <span>🎧 Your most played artist</span>
  <strong>{topArtist}</strong>
  <small>{topArtistCount.toLocaleString()} plays</small>
</div>

  <div className="insight-meta">
    <span>🌙 Midnight — 5 AM</span>
    <strong>{lateNightCount.toLocaleString()} moments</strong>
  </div>
</section>

      <header className="header">
        <div>
          <p className="eyebrow">DIGITAL LIFE ARCHIVE</p>

          <h1>
            Your Life,
            <br />
            <span>In Receipts.</span>
          </h1>

          <p className="intro">
            Hundreds of tiny digital moments. One story waiting to be
            discovered.
          </p>
        </div>

        <div className="stats">
          <div>
            <strong>{receipts.length}</strong>
            <span>receipts</span>
          </div>

          <div>
            <strong>6</strong>
            <span>chapters</span>
          </div>
        </div>
      </header>

      <section className="insight">
        <div className="insight-label">✦ PATTERN DISCOVERED</div>

        <h2>
          One ordinary evening
          <br />
          became a <em>memory.</em>
        </h2>

        <p>
          Music, a café visit, a purchase and a photo happened within the same
          few hours.
        </p>
      </section>

      <section className="explore">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE THE ARCHIVE</p>
            <h2>Receipts</h2>
          </div>

          <input
            type="search"
            placeholder="Search your life..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={activeFilter === filter ? "active" : ""}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="receipt-grid">
          {filteredReceipts.map((receipt) => (
            <button
              className="receipt-card"
              key={receipt.id}
              onClick={() => setSelectedReceipt(receipt)}
            >
              <div className="card-top">
                <span className="receipt-icon">{receipt.icon}</span>
                <span>{receipt.type}</span>
              </div>

              <h3>{receipt.title}</h3>

              <p>{receipt.description}</p>

              <div className="card-footer">
                <span>{receipt.date}</span>
                <span>{receipt.time}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedReceipt && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close"
              onClick={() => setSelectedReceipt(null)}
            >
              ×
            </button>

            <span className="receipt-icon large">
              {selectedReceipt.icon}
            </span>

            <p className="eyebrow">{selectedReceipt.type}</p>

            <h2>{selectedReceipt.title}</h2>

            <p>{selectedReceipt.description}</p>

            <div className="modal-details">
              <span>{selectedReceipt.date}</span>
              <span>{selectedReceipt.time}</span>
              <span>{selectedReceipt.place}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;