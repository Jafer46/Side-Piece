import { useEffect, useState } from "react";
import { AddProject, GetAllPersonas } from "../../../wailsjs/go/main/App";
import FormField from "./FormField";
import { models } from "../../../wailsjs/go/models";
import COLORS from "../../constants/colors";
import { Status, STATUS_LIST } from "../../constants/status";

const inputStyle = {
  width: "100%",
  background: COLORS.BACKGROUND,
  border: "0.5px solid #2e2e38",
  borderRadius: 6,
  padding: "9px 12px",
  color: COLORS.FOREGROUND,
  fontFamily: "IBM Plex Mono, monospace",
  fontSize: 12,
  outline: "none",
};

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
  const [status, setStatus] = useState<Status>(STATUS_LIST[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [personas, setPersonas] = useState<models.Persona[]>([]);
  const [loadingPersonas, setLoadingPersonas] = useState(false);

  useEffect(() => {
    setLoadingPersonas(true);
    GetAllPersonas().then(setPersonas).catch(console.error);
    setLoadingPersonas(false);
  }, []);

  async function handleSave() {
    if (loadingPersonas) return;
    if (!name.trim() || !path.trim()) {
      setError("Name and path are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const id = await AddProject(
        name.trim(),
        path.trim(),
        status,
        personaId,
        nag,
      );
      onAdd({
        id,
        name,
        path,
        personaId,
        status,
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
        <FormField label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            style={inputStyle}
          >
            {STATUS_LIST.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
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
            {personas.length > 0 &&
              personas.map(({ ID: key, ...cfg }) => (
                <div
                  key={key}
                  onClick={() => setCharacter(Number(key))}
                  style={{
                    border: `0.5px solid ${personaId === Number(key) ? COLORS.PRIMARY : COLORS.DARK}`,

                    borderRadius: 6,
                    padding: "10px 8px",
                    textAlign: "center",
                    cursor: "pointer",
                    background:
                      personaId === Number(key)
                        ? `${cfg.Color}18`
                        : COLORS.BACKGROUND,
                    transition: "all .15s",
                  }}
                >
                  <div style={{ fontSize: 18 }}>{cfg.Emoji}</div>
                  <div
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 11,
                      color:
                        personaId === Number(key)
                          ? COLORS.PRIMARY
                          : COLORS.FOREGROUND,
                      marginTop: 4,
                    }}
                  >
                    {cfg.Name}
                  </div>
                  <div
                    style={{ fontSize: 10, color: COLORS.MUTED, marginTop: 2 }}
                  >
                    {cfg.Description}
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
  border: "0.5px solid #2e2e38",
  color: "#9090a8",
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
