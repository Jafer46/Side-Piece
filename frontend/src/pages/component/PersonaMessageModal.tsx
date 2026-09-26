import { useState } from "react";
import { AddPersona, AddPersonaMessages } from "../../../wailsjs/go/main/App";
import FormField from "./FormField";
import COLORS from "../../constants/colors";
import EmojiPicker from "emoji-picker-react";
import { models } from "../../../wailsjs/go/models";

const inputStyle = {
  width: "100%",
  background: COLORS.BACKGROUND,
  border: `0.5px solid ${COLORS.DARK}`,
  borderRadius: 6,
  padding: "9px 12px",
  color: COLORS.FOREGROUND,
  fontFamily: "IBM Plex Mono, monospace",
  fontSize: 12,
  outline: "none",
};

const PersonaColors = [
  COLORS.PRIMARY,
  COLORS.SUCCESS,
  COLORS.WARNING,
  COLORS.DANGER,
  COLORS.MUTED,
];

const MESSAGE_TYPE = ["abandoned", "mild", "returning", "serious", "praise"];

export default function PersonaMessageModal({
  onClose,
  onAdd,
  data,
}: {
  onClose: any;
  onAdd: any;
  data?: models.PersonaMessages;
}) {
  const [personas, setPersonas] = useState<models.Persona[]>([]);
  const [personaId, setPersonaId] = useState<number>(data?.PersonaID || -1);
  const [message, setMessage] = useState<string>(data?.Message || "");
  const [messageType, setMessageType] = useState<string>(
    data?.MessageType || "",
  );
  const [character, setCharacter] = useState<string>(data?.Character || "");
  const [imagePath, setImagePath] = useState<string>(data?.ImagePath || "");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<Boolean>(false);

  async function handleSave() {
    if (!personaId || personaId < 0) {
      setError("persona id is required.");
      return;
    }
    if (!message.trim() || !messageType.trim()) {
      setError("message and message type are required.");
      return;
    }
    if (!image) {
      setError("image is required!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      //   const id = await AddPersonaMessages(
      //     personaId,
      //     message.trim(),
      //     messageType.trim(),
      //     character?.trim() || "",
      //   );
      //   onAdd({
      //     id,
      //     message,
      //     messageType,
      //     character,
      //   });
      onClose();
    } catch (e: any) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: COLORS.BACKGROUND,
          border: `0.5px solid ${COLORS.DARK}`,
          borderRadius: 12,
          padding: 28,
          width: "100%",
          maxWidth: 440,
        }}
      >
        <div
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 13,
            color: COLORS.PRIMARY,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          // register new persona
        </div>

        <FormField label="Persona name">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Eva the ever nagging wife"
            style={inputStyle}
          />
        </FormField>
        <FormField label="Persona Color">
          <select
            value={message}
            onChange={(e) => setMessageType(e.target.value)}
            style={inputStyle}
          >
            {MESSAGE_TYPE.map((c) => (
              <option key={c} value={c} style={{ display: "flex" }}>
                <div
                  style={{ width: "8px", height: "3px", backgroundColor: c }}
                ></div>
                {c}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Image">
          <input
            type="file"
            accept="image/*"
            style={inputStyle}
            onChange={(e) => {
              if (e.target.files?.length) {
                setImage(e.target.files[0]);
              }
              setImage(null);
            }}
          />
        </FormField>

        {error && (
          <div
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 11,
              color: COLORS.DANGER,
              marginTop: 8,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 24,
            justifyContent: "flex-end",
          }}
        >
          <button onClick={onClose} style={cancelBtnStyle}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading} style={saveBtnStyle}>
            {loading ? "Registering..." : "Register it"}
          </button>
        </div>
      </div>
    </div>
  );
}

const cancelBtnStyle = {
  background: "transparent",
  border: `0.5px solid ${COLORS.DARK}`,
  color: COLORS.LIGHT,
  padding: "8px 16px",
  borderRadius: 5,
  fontFamily: "IBM Plex Mono, monospace",
  fontSize: 11,
  cursor: "pointer",
};

const saveBtnStyle = {
  background: COLORS.PRIMARY,
  color: COLORS.FOREGROUND,
  border: "none",
  padding: "8px 16px",
  borderRadius: 5,
  fontFamily: "IBM Plex Mono, monospace",
  fontSize: 11,
  fontWeight: 500,
  cursor: "pointer",
};
