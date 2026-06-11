import COLORS from "../../constants/colors";

export default function PageHeader({
  title,
  subTitle,
  description,
  setShowModal,
}: {
  title: string;
  subTitle?: string;
  description?: string;
  setShowModal: (show: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 36,
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 11,
            color: COLORS.PRIMARY,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            marginBottom: 6,
            textAlign: "left",
          }}
        >
          // {title || ""}
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: "-.02em",
            textAlign: "left",
          }}
        >
          {subTitle || ""}
        </div>
        <div
          style={{
            fontSize: 13,
            color: COLORS.LIGHT,
            marginTop: 4,
            fontWeight: 300,
          }}
        >
          {description || ""}
        </div>
      </div>
      <button
        onClick={() => setShowModal(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: COLORS.PRIMARY,
          color: COLORS.FOREGROUND,
          border: "none",
          padding: "10px 18px",
          borderRadius: 6,
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 450,
        }}
      >
        + Register a new {title}
      </button>
    </div>
  );
}
