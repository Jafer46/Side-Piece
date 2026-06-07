export default function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 11,
          color: "#9090a8",
          letterSpacing: ".06em",
          textTransform: "uppercase",
          marginBottom: 6,
          display: "block",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
