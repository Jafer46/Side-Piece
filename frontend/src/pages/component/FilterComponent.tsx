export default function Filters({
  filter,
  filters,
  setFilter,
}: {
  filter: string;
  filters: string[];
  setFilter: (filter: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        marginBottom: 24,
        flexWrap: "wrap",
      }}
    >
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 11,
            padding: "5px 12px",
            borderRadius: 4,
            border: `0.5px solid ${filter === f ? "#ff4757" : "#2e2e38"}`,
            background: filter === f ? "rgba(255,71,87,.08)" : "transparent",
            color: filter === f ? "#ff4757" : "#9090a8",
            cursor: "pointer",
            letterSpacing: ".04em",
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
