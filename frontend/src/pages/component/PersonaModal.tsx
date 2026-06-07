import { useState } from "react";
import { AddPersona } from "../../../wailsjs/go/main/App";
import FormField from "./FormField";

const inputStyle = {
  width: "100%",
  background: "#1e1e24",
  border: "0.5px solid #2e2e38",
  borderRadius: 6,
  padding: "9px 12px",
  color: "#e8e8f0",
  fontFamily: "IBM Plex Mono, monospace",
  fontSize: 12,
  outline: "none",
};

export default function AddPersonaModal({
  onClose,
  onAdd,
}: {
  onClose: any;
  onAdd: any;
}) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!name.trim() || !gender.trim()) {
      setError("Name and path are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const id = await AddPersona(name.trim(), gender.trim());
      onAdd({
        id,
        name,
        gender,
      });
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
          background: "#16161a",
          border: "0.5px solid #3e3e4e",
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
            color: "#ff4757",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          // register new persona
        </div>

        <FormField label="Persona name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Eva the ever nagging wife"
            style={inputStyle}
          />
        </FormField>

        <FormField label="Persona Gender">
          <input
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            placeholder="Female"
            style={inputStyle}
          />
        </FormField>

        {error && (
          <div
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 11,
              color: "#e74c3c",
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
  border: "0.5px solid #2e2e38",
  color: "#9090a8",
  padding: "8px 16px",
  borderRadius: 5,
  fontFamily: "IBM Plex Mono, monospace",
  fontSize: 11,
  cursor: "pointer",
};

const saveBtnStyle = {
  background: "#ff4757",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 5,
  fontFamily: "IBM Plex Mono, monospace",
  fontSize: 11,
  fontWeight: 500,
  cursor: "pointer",
};
