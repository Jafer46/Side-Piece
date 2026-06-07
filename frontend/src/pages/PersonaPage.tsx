import { useEffect, useState } from "react";
import { models } from "../../wailsjs/go/models";
import { GetAllPersonas } from "../../wailsjs/go/main/App";
import Filters from "./component/FilterComponent";
import ActionButton from "./component/ActionButton";
import AddPersonaModal from "./component/PersonaModal";

function PersonaCard({
  persona,
  onDelete,
}: {
  persona: models.Persona;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      style={{
        background: "#16161a",
        border: "0.5px solid #2e2e38",
        borderRadius: 10,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "border-color .15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3e3e4e")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2e2e38")}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#e8e8f0",
            marginBottom: 3,
          }}
        >
          {persona.Name}
        </div>
        <div
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 11,
            color: "#5a5a72",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 380,
          }}
        >
          {persona.Gender}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <ActionButton onClick={() => onDelete(persona.ID)} hoverColor="#e74c3c">
          Remove
        </ActionButton>
      </div>
    </div>
  );
}

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

  function handleAdd(persona: models.Persona) {
    setPersonas((prev) => (prev ? [persona, ...prev] : [persona]));
  }

  function handleDelete(id: number) {
    setPersonas((prev) => prev.filter((p) => p.ID !== id));
  }

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
      <Filters filter="all" filters={["all"]} setFilter={() => {}} />
      {loading ? (
        <div
          style={{
            color: "#5a5a72",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 13,
            padding: "40px 0",
          }}
        >
          loading projects...
        </div>
      ) : (personas?.length || 0) === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#5a5a72",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>👻</div>
          <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13 }}>
            no projects here. they're all abandoned elsewhere.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {personas.map((p) => (
            <PersonaCard key={p.ID} persona={p} onDelete={handleDelete} />
          ))}
        </div>
      )}
      {showModal && (
        <AddPersonaModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
