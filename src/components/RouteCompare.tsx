import type { CompareTable } from "@/lib/routeAnswer";

/**
 * Visible comparison table (private shuttle vs. shared shuttle, taxi and
 * rental car). A real <table> in the server HTML, not a collapsed block:
 * Microsoft's guidance for Copilot citations and the 2026 citation studies
 * both favour tables that answer the comparison question directly, and
 * only the private-shuttle column states a price we control.
 */
export default function RouteCompare({ table }: { table: CompareTable | null }) {
  if (!table) return null;
  const [, ...columns] = table.columns;
  return (
    <section aria-labelledby="route-compare" className="mx-auto max-w-5xl px-6 pb-16">
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <h2 id="route-compare" className="text-xl font-bold text-foreground sm:text-2xl">
          {table.heading}
        </h2>
        <p className="mt-2 text-sm text-foreground/60">{table.intro}</p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th scope="col" className="py-3 pr-4 text-xs font-semibold uppercase tracking-wider text-foreground/40">
                  <span className="sr-only">{table.columns[0] || "Criterion"}</span>
                </th>
                {columns.map((col, i) => (
                  <th
                    key={col}
                    scope="col"
                    className={`py-3 pr-4 text-xs font-semibold uppercase tracking-wider ${
                      i === 0 ? "text-sunset-orange" : "text-foreground/50"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {table.rows.map(([label, ...cells]) => (
                <tr key={label}>
                  <th scope="row" className="py-3 pr-4 align-top font-semibold text-foreground">
                    {label}
                  </th>
                  {cells.map((cell, i) => (
                    <td
                      key={`${label}-${i}`}
                      className={`py-3 pr-4 align-top ${
                        i === 0 ? "font-medium text-foreground" : "text-foreground/70"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
