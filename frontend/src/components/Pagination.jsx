import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function pageRange(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (page >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", page - 1, page, page + 1, "…", total];
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = pageRange(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-md border border-border bg-[#0F111A] text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition"
        aria-label="previous"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`min-w-[2rem] h-8 px-2 rounded-md border text-sm font-semibold transition ${
              p === page
                ? "bg-primary border-primary text-white"
                : "bg-[#0F111A] border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
            }`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-md border border-border bg-[#0F111A] text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition"
        aria-label="next"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    </nav>
  );
}
