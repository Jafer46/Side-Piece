import { Link, useLocation } from "react-router";

const routes = [
  { path: "/", name: "Projects" },
  { path: "/personas", name: "Personas" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        backgroundColor: "#fff",
      }}
    >
      <nav
        style={{
          width: "200px",
          minHeight: "100vh",
          background: "#1e1e24",
          color: "#e8e8f0",
          fontSize: "12px",
        }}
      >
        <div
          style={{
            background: "#1e1e24",
            padding: "1.5rem 1.5rem 0 1.5rem",
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
      <div
        style={{
          background: "#0e0e10",
          minHeight: "100vh",
          color: "#e8e8f0",
          fontFamily: "IBM Plex Sans, sans-serif",
          position: "relative",
          width: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
