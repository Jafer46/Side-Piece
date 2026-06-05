import { useEffect, useState } from "react";
import { models } from "../../wailsjs/go/models";
import { GetAllPersonas } from "../../wailsjs/go/main/App";

export default function PersonasPage() {
  const [personas, setPersonas] = useState<models.Persona[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [showModal, setShowModal] = useState<Boolean>(false);

  useEffect(() => {
    setLoading(true);
    GetAllPersonas()
      .then(setPersonas)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
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
              color: "#ff4757",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              marginBottom: 6,
              textAlign: "left",
            }}
          >
            // personas
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 500,
              letterSpacing: "-.02em",
              textAlign: "left",
            }}
          >
            Sidepieces Persona
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#9090a8",
              marginTop: 4,
              fontWeight: 300,
            }}
          >
            Here are a defined personas for your sidepieces.
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#ff4757",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 6,
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          + Create Persona
        </button>
      </div>
    </div>
  );
}
