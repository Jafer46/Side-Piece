import Badge from "./Badge";

export default function PageSelector({
  page,
  availablePages,
  setPage,
}: {
  page: number;
  availablePages: number;
  setPage: (page: number) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 12, padding: 12 }}>
      <div style={{ flexGrow: 3 }}></div>
      <button
        disabled={page === 1}
        onClick={() => setPage(1)}
        style={{
          all: "unset",
          cursor:
            page === availablePages || availablePages === 1
              ? "not-allowed"
              : "pointer",
        }}
      >
        <Badge>{"<<<"}</Badge>
      </button>
      {page > 1 && (
        <button
          disabled={page === 1 || availablePages === 1}
          onClick={() => setPage(page - 1)}
          style={{
            all: "unset",
            cursor:
              page === availablePages || availablePages === 1
                ? "not-allowed"
                : "pointer",
          }}
        >
          <Badge>{page - 1}</Badge>
        </button>
      )}

      <Badge>{page}</Badge>

      {page < availablePages && (
        <button
          disabled={page === availablePages || availablePages === 1}
          onClick={() => setPage(page + 1)}
          style={{
            all: "unset",
            cursor:
              page === availablePages || availablePages === 1
                ? "not-allowed"
                : "pointer",
          }}
        >
          <Badge>{page + 1}</Badge>
        </button>
      )}
      <button
        disabled={page === availablePages}
        onClick={() => setPage(availablePages)}
        style={{
          all: "unset",
          cursor:
            page === availablePages || availablePages === 1
              ? "not-allowed"
              : "pointer",
        }}
      >
        <Badge>{">>>"}</Badge>
      </button>
    </div>
  );
}
