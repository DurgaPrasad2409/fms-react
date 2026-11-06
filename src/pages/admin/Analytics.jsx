import { getAllFeedback } from "../../lib/storage";
import { CATEGORIES, STATUSES } from "../../lib/constants";

/** Horizontal bar chart drawn with plain divs — no chart library needed. */
function BarChart({ title, rows }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="card chart-card">
      <h3>{title}</h3>
      {rows.map((r) => (
        <div className="bar-row" key={r.label}>
          <span className="bar-label">{r.label}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(r.value / max) * 100}%`, background: r.color }} />
          </div>
          <span className="bar-value">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const all = getAllFeedback();
  const total = all.length;
  const avg = total ? (all.reduce((s, f) => s + f.rating, 0) / total).toFixed(1) : "—";
  const count = (fn) => all.filter(fn).length;

  const TEAL = "#1F6F6B", GOLD = "#E7A93C", CORAL = "#D65F5F";
  const statusColor = { Pending: CORAL, Reviewed: GOLD, Resolved: TEAL };
  const ratingColor = { 1: CORAL, 2: CORAL, 3: GOLD, 4: TEAL, 5: TEAL };

  return (
    <main className="page wide">
      <div className="eyebrow">Admin Module</div>
      <h1>Insights</h1>
      <p className="subtitle">A quick read on how customers feel and where issues cluster.</p>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{total}</div><div className="stat-label">Total feedback</div></div>
        <div className="stat-card"><div className="stat-value">{avg}</div><div className="stat-label">Average rating</div></div>
        <div className="stat-card"><div className="stat-value">{count((f) => f.status === "Pending")}</div><div className="stat-label">Pending review</div></div>
        <div className="stat-card"><div className="stat-value">{count((f) => f.status === "Resolved")}</div><div className="stat-label">Resolved</div></div>
      </div>

      {total === 0 ? (
        <div className="card empty-state">No feedback yet — charts will appear once users submit some.</div>
      ) : (
        <>
          <BarChart title="Feedback volume by category"
            rows={CATEGORIES.map((c) => ({ label: c, value: count((f) => f.category === c), color: TEAL }))} />
          <BarChart title="Rating distribution"
            rows={[5, 4, 3, 2, 1].map((n) => ({ label: `${n} star${n > 1 ? "s" : ""}`, value: count((f) => f.rating === n), color: ratingColor[n] }))} />
          <BarChart title="Status breakdown"
            rows={STATUSES.map((s) => ({ label: s, value: count((f) => f.status === s), color: statusColor[s] }))} />
        </>
      )}
    </main>
  );
}
