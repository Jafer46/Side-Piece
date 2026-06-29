import { useEffect, useState } from "react";
import { models } from "../../wailsjs/go/models";
import { GetAllPersonas } from "../../wailsjs/go/main/App";
import Filters from "./component/FilterComponent";
import ActionButton from "./component/ActionButton";
import AddPersonaModal from "./component/PersonaModal";
import COLORS from "../constants/colors";
import PageHeader from "./component/PageHeader";

function PersonaCard({
  persona,
  onShow,
  onDelete,
}: {
  persona: models.Persona;
  onShow: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      style={{
        background: COLORS.BACKGROUND,
        border: `0.5px solid ${COLORS.DARK}`,
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
            color: COLORS.FOREGROUND,
            marginBottom: 3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 380,
            textAlign: "left",
          }}
        >
          {persona.Name}
        </div>
        <div
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 11,
            color: COLORS.MUTED,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 380,
            textAlign: "left",
          }}
        >
          {persona.Gender}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <ActionButton
          onClick={() => onShow(persona.ID)}
          hoverColor={COLORS.WARNING}
        >
          Show
        </ActionButton>
        <ActionButton
          onClick={() => onDelete(persona.ID)}
          hoverColor={COLORS.DANGER}
        >
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

  function handleShow(id: number) {}

  return (
    <>
      <PageHeader
        title="Personas"
        subTitle=""
        description=""
        setShowModal={setShowModal}
      />
      <Filters filter="all" filters={["all"]} setFilter={() => {}} />
      {loading ? (
        <div
          style={{
            color: COLORS.MUTED,
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
            color: COLORS.MUTED,
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
            <PersonaCard
              key={p.ID}
              persona={p}
              onShow={handleShow}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      {showModal && (
        <AddPersonaModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </>
  );
}
