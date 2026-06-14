import { Link, useLocation } from "react-router";
import Badge from "./pages/component/Badge";
import COLORS from "./constants/colors";
import { useState } from "react";

const routes = [
  { path: "/", name: "Projects" },
  { path: "/personas", name: "Personas" },
  { path: "/repos", name: "Repos" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        maxWidth: "100vw",
        backgroundColor: "#fff",
      }}
    >
      <nav
        style={{
          width: open ? "200px" : "0px",
          minHeight: "100vh",
          background: "#1e1e24",
          color: "#e8e8f0",
          fontSize: "12px",
          position: "fixed",
          zIndex: 4,
          overflow: "hidden",
          transition: "width .15s",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            alignItems: "baseline",
            padding: ".2rem",
          }}
        >
          <button
            style={{ all: "unset" }}
            onClick={() => setOpen((open) => !open)}
          >
            <Badge color={COLORS.LIGHT}>X</Badge>
          </button>
        </div>
        <div
          style={{
            background: "#1e1e24",
            borderBottom: "0.5px solid #2e2e38",
            fontFamily: "IBM Plex Mono, monospace",
          }}
        >
          <h1>Logo</h1>
        </div>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
          }}
        >
          {routes.map((route) => (
            <li
              style={{
                padding: 0,
                marginBottom: ".2rem",
              }}
            >
              <Link
                to={route.path}
                style={{
                  display: "block",
                  padding: "0.8rem 1.5rem",
                  fontSize: "16px",
                  textDecoration: "none",
                  color: "#e8e8f0",
                  backgroundColor:
                    location.pathname === route.path ? "#ff4757" : "",
                  fontFamily: "IBM Plex Mono, monospace",
                }}
              >
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button
        style={{ all: "unset", position: "fixed", zIndex: 1 }}
        onClick={() => setOpen((open) => !open)}
      >
        <Badge color={COLORS.LIGHT}>=</Badge>
      </button>
      <div
        style={{
          background: "#0e0e10",
          minHeight: "100vh",
          color: "#e8e8f0",
          fontFamily: "IBM Plex Sans, sans-serif",
          position: "relative",
          width: "100%",
        }}
        onClick={() => {
          if (open) {
            setOpen(false);
          }
        }}
      >
        <div style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
