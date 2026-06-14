import { useEffect, useState } from "react";
import PageHeader from "./component/PageHeader";
import Filters from "./component/FilterComponent";
import { GetAllRepos, ScanAndCache } from "../../wailsjs/go/main/App";
import { models } from "../../wailsjs/go/models";
import COLORS from "../constants/colors";

const filters = ["all"];
export default function ReposPage() {
  const [repos, setRepos] = useState<models.DiscoveredRepos[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    GetAllRepos()
      .then(setRepos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function regenerateCached() {
    setLoading(true);
    ScanAndCache();
    GetAllRepos()
      .then(setRepos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  return (
    <>
      <PageHeader
        title="Repos"
        subTitle="List of available repos"
        description=""
        setShowModal={regenerateCached}
      />
      <Filters filter={filter} filters={filters} setFilter={setFilter} />
      {isLoading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        <div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              fontSize: 13,
            }}
          >
            <colgroup>
              <col style={{ width: "18%" }} />
              <col style={{ width: "42%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr style={{ background: COLORS.SECONDARY }}>
                {["Name", "Path", "Branch", "Last Commit"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      fontWeight: 500,
                      fontSize: 11,
                      color: COLORS.LIGHT,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      borderBottom: `0.5px solid ${COLORS.FOREGROUND}22`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {repos.map((r) => (
                <tr
                  key={r.Path}
                  style={{ borderBottom: `0.5px solid ${COLORS.FOREGROUND}14` }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = COLORS.SECONDARY)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* Shared cell style */}
                  {[r.Name, r.Path, r.Branch, r.LastCommit].map((val, i) => (
                    <td
                      key={i}
                      title={val}
                      style={{
                        padding: "10px 14px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: i === 3 ? COLORS.LIGHT : COLORS.FOREGROUND,
                        fontFamily: i === 3 ? "monospace" : "inherit",
                        fontSize: i === 3 ? 12 : 13,
                        textAlign: "left",
                      }}
                    >
                      {i === 1 ? (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 6,
                          }}
                        >
                          <span style={{ color: COLORS.MUTED, flexShrink: 0 }}>
                            📁
                          </span>
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {val}
                          </span>
                        </span>
                      ) : (
                        val
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
