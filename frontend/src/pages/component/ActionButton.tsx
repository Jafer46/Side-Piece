import { useState } from "react";
import COLORS from "../../constants/colors";

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
        border: `0.5px solid ${hovered ? hoverColor : COLORS.DARK}`,
        color: hovered ? hoverColor : COLORS.LIGHT,
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
