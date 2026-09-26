import { useEffect, useState } from "react";
import { models } from "../../wailsjs/go/models";
import { GetAllPersonas } from "../../wailsjs/go/main/App";
import Filters from "./component/FilterComponent";
import ActionButton from "./component/ActionButton";
import AddPersonaModal from "./component/PersonaModal";
import COLORS from "../constants/colors";
import PageHeader from "./component/PageHeader";
import { Navigator, useNavigate } from "react-router";

function PersonaCard({
  persona,
  onShow,
  onDelete,
}: {
  persona: models.Persona;
  onShow: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const color = persona.Color || COLORS.MUTED;
  const messageCount = persona.Messages?.length ?? 0;

  return (
    <div
      style={{
        background: COLORS.BACKGROUND,
        border: `0.5px solid ${COLORS.DARK}`,
        borderRadius: 10,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "border-color .15s, background .15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#3e3e4e";
        e.currentTarget.style.background = "#1a1a20";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.DARK;
        e.currentTarget.style.background = COLORS.BACKGROUND;
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: `${color}18`,
          border: `0.5px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {persona.Emoji || "🙂"}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: COLORS.FOREGROUND,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 260,
            }}
          >
            {persona.Name}
          </span>
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 10,
              padding: "2px 7px",
              borderRadius: 3,
              border: `0.5px solid ${color}`,
              color,
              background: `${color}18`,
              letterSpacing: ".04em",
              textTransform: "capitalize",
              flexShrink: 0,
            }}
          >
            {persona.Gender}
          </span>
        </div>

        <div
          style={{
            fontSize: 12,
            color: COLORS.MUTED,
            marginTop: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 420,
            fontWeight: 300,
            textAlign: "left",
          }}
        >
          {persona.Description || "No description yet."}
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 10,
              padding: "3px 8px",
              borderRadius: 3,
              border: `0.5px solid ${COLORS.DARK}`,
              color: COLORS.MUTED,
              letterSpacing: ".04em",
            }}
          >
            {messageCount} message{messageCount !== 1 ? "s" : ""}
          </span>
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
  const navigate = useNavigate();

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

  function handleShow(id: number) {
    navigate(`/personas/messages/${id}`);
  }

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
