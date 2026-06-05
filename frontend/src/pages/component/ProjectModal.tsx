import { useState } from "react";
import { AddProject } from "../../../wailsjs/go/main/App";

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

export const CHAR_CONFIG = {
  1: {
    label: "Marcus",
    desc: "Passive aggressive",
    emoji: "👨",
    color: "#7b8cde",
  },
  2: {
    label: "Ava",
    desc: "Emotionally intense",
    emoji: "👩",
    color: "#e8a0bf",
  },
  3: {
    label: "The Ghost",
    desc: "Just haunts you",
    emoji: "👻",
    color: "#a0d4b5",
  },
};

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 11,
          color: "#9090a8",
          letterSpacing: ".06em",
          textTransform: "uppercase",
          marginBottom: 6,
          display: "block",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AddProjectModal({
  onClose,
  onAdd,
}: {
  onClose: any;
  onAdd: any;
}) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [nag, setNag] = useState(24);
  const [personaId, setCharacter] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!name.trim() || !path.trim()) {
      setError("Name and path are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const id = await AddProject(name.trim(), path.trim(), personaId, nag);
      onAdd({
        id,
        name,
        path,
        personaId,
        status: "active",
        nag_interval_hours: nag,
        last_commit_at: null,
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
          // register new project
        </div>

        <FormField label="Project name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My brilliant SaaS idea"
            style={inputStyle}
          />
        </FormField>

        <FormField label="Local path">
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="C:\Users\you\projects\my-saas"
            style={inputStyle}
          />
        </FormField>

        <FormField label="Nag every">
          <select
            value={nag}
            onChange={(e) => setNag(Number(e.target.value))}
            style={inputStyle}
          >
            <option value={6}>6 hours</option>
            <option value={12}>12 hours</option>
            <option value={24}>24 hours (daily)</option>
            <option value={48}>48 hours</option>
          </select>
        </FormField>

        <FormField label="Persona">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 8,
              marginTop: 6,
            }}
          >
            {Object.entries(CHAR_CONFIG).map(([key, cfg]) => (
              <div
                key={key}
                onClick={() => setCharacter(Number(key))}
                style={{
                  border: `0.5px solid ${personaId === Number(key) ? cfg.color : "#2e2e38"}`,
                  borderRadius: 6,
                  padding: "10px 8px",
                  textAlign: "center",
                  cursor: "pointer",
                  background:
                    personaId === Number(key) ? `${cfg.color}18` : "#1e1e24",
                  transition: "all .15s",
                }}
              >
                <div style={{ fontSize: 18 }}>{cfg.emoji}</div>
                <div
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 11,
                    color: "#e8e8f0",
                    marginTop: 4,
                  }}
                >
                  {cfg.label}
                </div>
                <div style={{ fontSize: 10, color: "#5a5a72", marginTop: 2 }}>
                  {cfg.desc}
                </div>
              </div>
            ))}
          </div>
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
