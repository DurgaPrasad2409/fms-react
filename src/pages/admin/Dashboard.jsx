import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFeedback } from "../../lib/storage";
import { CATEGORIES, STATUSES } from "../../lib/constants";
import StatusBadge from "../../components/StatusBadge";
import PulseStrip from "../../components/PulseStrip";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export default function Dashboard() {
  const [all] = useState(() => getAllFeedback().slice().reverse()); // newest first
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter((f) =>
      (!q || f.comment.toLowerCase().includes(q) || f.customerName.toLowerCase().includes(q)) &&
      (!category || f.category === category) &&
      (!status || f.status === status) &&
      (!rating || f.rating === Number(rating))
    );
  }, [all, search, category, status, rating]);

  return (
    <main className="page wide">
      <div className="eyebrow">Admin Module</div>
      <h1>All feedback</h1>
      <p className="subtitle">Filter, search, and open any entry to update its status.</p>

      <PulseStrip items={all.slice(0, 30).reverse()} label="Sentiment pulse" />

      <div className="toolbar">
        <input type="text" className="search" placeholder="Search comments or names…"
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">All ratings</option>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
        </select>
      </div>

      <div className="card flush-card">
        {filtered.length === 0 ? (
          <div className="empty-state">No feedback matches these filters.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Date</th><th>Customer</th><th>Category</th><th>Rating</th><th>Comment</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id}>
                  <td data-label="Date">{formatDate(f.date)}</td>
                  <td data-label="Customer">{f.customerName}</td>
                  <td data-label="Category">{f.category}</td>
                  <td data-label="Rating">{"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}</td>
                  <td data-label="Comment">{f.comment.length > 60 ? f.comment.slice(0, 60) + "…" : f.comment}</td>
                  <td data-label="Status">
                    <Link to={`/admin/feedback/${f.id}`}><StatusBadge status={f.status} /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
