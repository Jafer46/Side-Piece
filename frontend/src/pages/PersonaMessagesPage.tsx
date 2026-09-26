import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { models } from "../../wailsjs/go/models";
import { GetMessagesByPerson } from "../../wailsjs/go/main/App";
import COLORS from "../constants/colors";
import ActionButton from "./component/ActionButton";
import PageHeader from "./component/PageHeader";

export default function PersonaMessagesPage({}) {
  const { pid } = useParams<{ pid: string }>();
  const [messages, setMessages] = useState<models.PersonaMessages[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    GetMessagesByPerson(Number(pid))
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
    console.log("Loaded Messages");
  }, [pid]);

  function handleDelete(id: number) {}

  return (
    <div>
      <PageHeader
        title={
          <span>
            <Link to={"/personas"} style={{ all: "inherit" }}>
              persona/
            </Link>{" "}
            <span>message</span>
          </span>
        }
        subTitle="Your Persona Messages"
        description="Manage persona messages"
        setShowModal={setShowModal}
      />
      {loading ? (
        <div>Loading data</div>
      ) : (
        messages.map((message) => (
          <div
            style={{
              marginBottom: 10,
            }}
          >
            <MessageCard
              message={message}
              onDelete={() => handleDelete(message.ID)}
            />
          </div>
        ))
      )}
    </div>
  );
}

function MessageCard({
  message,
  onDelete,
}: {
  message: models.PersonaMessages;
  onDelete: (id: number) => void;
}) {
  const color = COLORS.MUTED;

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
        <image path={message.ImagePath} />
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
            {message.MessageType.toLocaleUpperCase()}
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
            {message.IsDefault ? "Default" : ""}
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
          {message.Message || "No message yet."}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <ActionButton
          onClick={() => onDelete(message.ID)}
          hoverColor={COLORS.DANGER}
        >
          Remove
        </ActionButton>
      </div>
    </div>
  );
}
