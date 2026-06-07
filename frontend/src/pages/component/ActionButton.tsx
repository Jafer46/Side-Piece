import { useState } from "react";

export default function ActionButton({
  children,
  onClick,
  hoverColor,
}: {
  children: React.ReactNode;
  onClick: any;
  hoverColor: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "transparent",
        border: `0.5px solid ${hovered ? hoverColor : "#2e2e38"}`,
        color: hovered ? hoverColor : "#9090a8",
        padding: "6px 10px",
        borderRadius: 5,
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 11,
        cursor: "pointer",
        transition: "all .15s",
      }}
    >
      {children}
    </button>
  );
}
