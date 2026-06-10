import COLORS from "../../constants/colors";

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
            border: `0.5px solid ${filter === f ? COLORS.PRIMARY : COLORS.DARK}`,
            background: filter === f ? COLORS.BACKGROUND : "transparent",
            color: filter === f ? COLORS.PRIMARY : COLORS.LIGHT,
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
