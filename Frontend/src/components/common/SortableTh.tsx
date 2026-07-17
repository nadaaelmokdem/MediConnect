import { MdArrowUpward, MdArrowDownward, MdUnfoldMore } from "react-icons/md";

interface SortableThProps {
  label: string;
  sortKey: string;
  activeSortKey: string;
  sortDescending: boolean;
  onSort: (key: string) => void;
  className?: string;
}

export default function SortableTh({ label, sortKey, activeSortKey, sortDescending, onSort, className = "" }: SortableThProps) {
  const isActive = activeSortKey === sortKey;
  return (
    <th className={`px-4 py-3 font-semibold ${className}`}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
      >
        {label}
        {isActive ? (
          sortDescending ? <MdArrowDownward size={14} /> : <MdArrowUpward size={14} />
        ) : (
          <MdUnfoldMore size={14} className="opacity-40" />
        )}
      </button>
    </th>
  );
}
