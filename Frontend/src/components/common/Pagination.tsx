import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pageSize, totalCount, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalCount === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-surface-variant text-sm">
      <span className="text-outline-variant">
        Showing <span className="font-semibold text-on-surface">{start}-{end}</span> of{" "}
        <span className="font-semibold text-on-surface">{totalCount}</span>
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg border border-surface-variant text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <MdChevronLeft size={18} />
        </button>
        <span className="text-on-surface-variant font-medium min-w-[70px] text-center">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-lg border border-surface-variant text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <MdChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
