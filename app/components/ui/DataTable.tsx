import type { ReactNode } from "react";
import { cn } from "./cn";

export interface DataTableColumn {
  label: string;
  srOnly?: boolean;
  align?: "left" | "center" | "right";
}

const alignmentClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function DataTable({
  columns,
  rows,
  caption,
  rowHeaders = false,
  minWidth = "40rem",
  className,
}: {
  columns: DataTableColumn[];
  rows: ReactNode[][];
  caption: string;
  rowHeaders?: boolean;
  minWidth?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-xl border border-border bg-surface",
        className,
      )}
    >
      <table
        className="w-full border-collapse text-sm"
        style={{ minWidth }}
      >
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface-raised">
          <tr>
            {columns.map((column, index) => (
              <th
                key={`${column.label}-${index}`}
                scope="col"
                className={cn(
                  "px-4 py-3 font-mono text-xs font-medium uppercase tracking-[0.12em] text-muted",
                  alignmentClasses[column.align ?? "left"],
                )}
              >
                {column.srOnly ? (
                  <span className="sr-only">{column.label}</span>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-border align-top"
            >
              {row.map((cell, cellIndex) => {
                const isRowHeader = rowHeaders && cellIndex === 0;
                const cellClass = cn(
                  "px-4 py-3 leading-relaxed",
                  isRowHeader
                    ? "font-medium text-foreground"
                    : "text-foreground",
                );

                return isRowHeader ? (
                  <th
                    key={cellIndex}
                    scope="row"
                    className={cellClass}
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={cellIndex} className={cellClass}>
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
