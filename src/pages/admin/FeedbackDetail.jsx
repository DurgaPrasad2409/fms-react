import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFeedbackById, updateFeedback } from "../../lib/storage";
import { STATUSES } from "../../lib/constants";

export default function FeedbackDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(() => getFeedbackById(id));
  const [status, setStatus] = useState(item?.status || "Pending");
  const [notes, setNotes] = useState(item?.adminNotes || "");
  const [saved, setSaved] = useState(false);

  if (!item) {
    return (
      <main className="page">
        <Link to="/admin" className="hint">← Back to dashboard</Link>
        <div className="card empty-state spaced">Feedback not found.</div>
      </main>
    );
  }

  const handleSave = () => {
    setItem(updateFeedback(item.id, { status, adminNotes: notes }));
    setSaved(true);
  };

  return (
    <main className="page">
      <Link to="/admin" className="hint">← Back to dashboard</Link>

      <div className="spaced">
        <div className="eyebrow">{item.category} · {new Date(item.date).toLocaleString()}</div>
        <h1>{item.customerName}'s feedback</h1>

        <div className="card list-card">
          <div className="field">
            <label>Rating</label>
            <div className="big-stars">{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</div>
          </div>
          <div className="field">
            <label>Comment</label>
            <p className="flush">{item.comment}</p>
          </div>
        </div>

        <div className="card">
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" value={status} onChange={(e) => { setStatus(e.target.value); setSaved(false); }}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="notes">Internal notes</label>
            <textarea id="notes" value={notes} placeholder="Notes only visible to admins…"
              onChange={(e) => { setNotes(e.target.value); setSaved(false); }} />
          </div>
          <button className="btn btn-primary" onClick={handleSave}>Save changes</button>
          {saved && <span className="hint ok">Saved ✓</span>}
        </div>
      </div>
    </main>
  );
}
