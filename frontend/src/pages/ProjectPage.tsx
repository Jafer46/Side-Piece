import { useState, useEffect } from "react";
import {
  GetProjects,
  DeleteProject,
  UpdateProjectStatus,
} from "../../wailsjs/go/main/App";
import { models } from "../../wailsjs/go/models";
import AddProjectModal, { CHAR_CONFIG } from "./component/ProjectModal";

type Status = "active" | "idle" | "abandoned" | "paused";

const STATUS_COLORS = {
  active: { dot: "#2ecc71", shadow: "0 0 6px #2ecc71" },
  idle: { dot: "#f39c12", shadow: "none" },
  abandoned: { dot: "#e74c3c", shadow: "none" },
  paused: { dot: "#5a5a72", shadow: "none" },
};

function nagLabel(h: any) {
  return h < 24 ? `every ${h}h` : `every ${h / 24}d`;
}

function StatusDot({ status }: { status: Status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.paused;
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: c.dot,
        boxShadow: c.shadow,
        flexShrink: 0,
        display: "inline-block",
      }}
    />
  );
}

function Badge({
  children,
  color = "#5a5a72",
  bg = "transparent",
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}) {
  return (
    <span
      style={{
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 10,
        padding: "3px 8px",
        borderRadius: 3,
        border: `0.5px solid ${color}`,
        color,
        background: bg,
        letterSpacing: ".04em",
      }}
    >
      {children}
    </span>
  );
}

function ProjectCard({
  project,
  onDelete,
  onTogglePause,
}: {
  project: models.Project;
  onDelete: any;
  onTogglePause: any;
}) {
  const char = CHAR_CONFIG[1];
  const isPaused = project.Status === "paused";

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
        opacity: isPaused ? 0.55 : 1,
        transition: "border-color .15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3e3e4e")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2e2e38")}
    >
      <StatusDot status={project.Status as Status} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#e8e8f0",
            marginBottom: 3,
          }}
        >
          {project.Name}
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
          {project.Path}
        </div>
        <div
          style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}
        >
          <Badge
            color={STATUS_COLORS[project.Status as Status]?.dot || "#5a5a72"}
            bg={`${STATUS_COLORS[project.Status as Status]?.dot || "#5a5a72"}18`}
          >
            {project.Status}
          </Badge>
          <Badge color={char.color} bg={`${char.color}18`}>
            {char.label}
          </Badge>
          <Badge color="#5a5a72">{nagLabel(project.NagIntervalHours)}</Badge>
          {project.LastCommitAt && (
            <Badge color="#5a5a72">
              {new Date(project.LastCommitAt).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <ActionButton
          onClick={() => onTogglePause(project.ID, project.Status)}
          hoverColor="#f39c12"
        >
          {isPaused ? "Resume" : "Pause"}
        </ActionButton>
        <ActionButton onClick={() => onDelete(project.ID)} hoverColor="#e74c3c">
          Remove
        </ActionButton>
      </div>
    </div>
  );
}

function ActionButton({
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
        border: `0.5px solid ${hovered ? hoverColor : "#2e2e38"}`,
        color: hovered ? hoverColor : "#9090a8",
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

const FILTERS = ["all", "active", "idle", "abandoned", "paused"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<models.Project[]>([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    await DeleteProject(id);
    setProjects((prev) => prev.filter((p) => p.ID !== id));
  }

  async function handleTogglePause(id: number, currentStatus: string) {
    const newStatus = currentStatus === "paused" ? "active" : "paused";
    await UpdateProjectStatus(id, newStatus);
    // TODO: update project
    // FIXME:
    // setProjects((prev: any) =>
    //   prev.map((p: any) => (p.ID === id ? { ...p, status: newStatus } : p)),
    // );
  }

  function handleAdd(project: models.Project) {
    setProjects((prev) => (prev ? [project, ...prev] : [project]));
  }

  const visible =
    filter === "all" ? projects : projects.filter((p) => p.Status === filter);
  const counts = {
    active: projects?.filter((p) => p.Status === "active")?.length || 0,
    idle: projects?.filter((p) => p.Status === "idle")?.length || 0,
    abandoned: projects?.filter((p) => p.Status === "abandoned")?.length || 0,
  };

  return (
    <>
      <div style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
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
              // projects
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 500,
                letterSpacing: "-.02em",
                textAlign: "left",
              }}
            >
              Your sidepieces
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#9090a8",
                marginTop: 4,
                fontWeight: 300,
              }}
            >
              Projects being watched. They remember everything.
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
            + Register project
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          {[
            {
              label: "Registered",
              val: projects?.length || 0,
              color: "#e8e8f0",
            },
            { label: "Active", val: counts.active, color: "#2ecc71" },
            { label: "Idle", val: counts.idle, color: "#f39c12" },
            { label: "Abandoned", val: counts.abandoned, color: "#e74c3c" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "#16161a",
                border: "0.5px solid #2e2e38",
                borderRadius: 8,
                padding: "12px 18px",
                minWidth: 110,
              }}
            >
              <div
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 20,
                  fontWeight: 500,
                  color: s.color,
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#5a5a72",
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 11,
                padding: "5px 12px",
                borderRadius: 4,
                border: `0.5px solid ${filter === f ? "#ff4757" : "#2e2e38"}`,
                background:
                  filter === f ? "rgba(255,71,87,.08)" : "transparent",
                color: filter === f ? "#ff4757" : "#9090a8",
                cursor: "pointer",
                letterSpacing: ".04em",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Project list */}
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
        ) : (visible?.length || 0) === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#5a5a72",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>
              👻
            </div>
            <div
              style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13 }}
            >
              no projects here. they're all abandoned elsewhere.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {visible.map((p) => (
              <ProjectCard
                key={p.ID}
                project={p}
                onDelete={handleDelete}
                onTogglePause={handleTogglePause}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddProjectModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </>
  );
}
