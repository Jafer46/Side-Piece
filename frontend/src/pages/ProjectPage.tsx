import { useState, useEffect } from "react";
import {
  GetProjects,
  DeleteProject,
  UpdateProjectStatus,
} from "../../wailsjs/go/main/App";
import { models } from "../../wailsjs/go/models";
import AddProjectModal from "./component/ProjectModal";
import Filters from "./component/FilterComponent";
import ActionButton from "./component/ActionButton";
import PageSelector from "./component/PageSelector";
import Badge from "./component/Badge";
import COLORS from "../constants/colors";
import { Status } from "../constants/status";

const STATUS_COLORS = {
  active: { dot: COLORS.SUCCESS, shadow: "0 0 6px #2ecc71" },
  idle: { dot: COLORS.WARNING, shadow: "none" },
  abandoned: { dot: COLORS.DANGER, shadow: "none" },
  paused: { dot: COLORS.MUTED, shadow: "none" },
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

function ProjectCard({
  project,
  onDelete,
  onTogglePause,
}: {
  project: models.Project;
  onDelete: any;
  onTogglePause: any;
}) {
  const isPaused = project.Status === "paused";

  return (
    <div
      style={{
        background: COLORS.BACKGROUND,
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
            color: COLORS.FOREGROUND,
            marginBottom: 3,
            textAlign: "left",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 380,
          }}
        >
          {project.Name}
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
          {project.Path}
        </div>
        <div
          style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}
        >
          <Badge
            color={STATUS_COLORS[project.Status as Status]?.dot || COLORS.MUTED}
            bg={`${STATUS_COLORS[project.Status as Status]?.dot || COLORS.MUTED}18`}
          >
            {project.Status}
          </Badge>
          {/* <Badge color={char.color} bg={`${char.color}18`}>
            {char.label}
          </Badge> */}
          <Badge color={COLORS.MUTED}>
            {nagLabel(project.NagIntervalHours)}
          </Badge>
          {project.LastCommitAt && (
            <Badge color={COLORS.MUTED}>
              {new Date(project.LastCommitAt).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <ActionButton
          onClick={() => onTogglePause(project.ID, project.Status)}
          hoverColor={COLORS.WARNING}
        >
          {isPaused ? "Resume" : "Pause"}
        </ActionButton>
        <ActionButton
          onClick={() => onDelete(project.ID)}
          hoverColor={COLORS.DANGER}
        >
          Remove
        </ActionButton>
      </div>
    </div>
  );
}

const FILTERS = ["all", "active", "idle", "abandoned", "paused"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<models.Project[]>([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [availablePages, setAvailablePages] = useState(1);

  useEffect(() => {
    GetProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
    console.log(projects);
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
                color: COLORS.PRIMARY,
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
                color: COLORS.LIGHT,
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
              background: COLORS.PRIMARY,
              color: COLORS.FOREGROUND,
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
              color: COLORS.FOREGROUND,
            },
            { label: "Active", val: counts.active, color: COLORS.SUCCESS },
            { label: "Idle", val: counts.idle, color: COLORS.SUCCESS },
            { label: "Abandoned", val: counts.abandoned, color: COLORS.DANGER },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: COLORS.BACKGROUND,
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
                  color: COLORS.MUTED,
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
        <Filters filter={filter} filters={FILTERS} setFilter={setFilter} />

        {/* Project list */}
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
        ) : (visible?.length || 0) === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: COLORS.MUTED,
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
        <PageSelector
          page={page}
          availablePages={availablePages}
          setPage={setPage}
        />
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
