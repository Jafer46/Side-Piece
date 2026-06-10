import COLORS from "../../constants/colors";

export default function Badge({
  children,
  color = COLORS.MUTED,
  bg = "transparent",
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}) {
  return (
    <span
      style={{
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 10,
        padding: "3px 8px",
        borderRadius: 3,
        border: `0.5px solid ${color}`,
        color,
        background: bg,
        letterSpacing: ".04em",
      }}
    >
      {children}
    </span>
  );
}
