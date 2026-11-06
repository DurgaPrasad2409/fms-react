import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyFeedback } from "../../lib/storage";
import StatusBadge from "../../components/StatusBadge";

export default function MyFeedback() {
  const { user } = useAuth();
  const location = useLocation();
  const items = getMyFeedback(user.username); // only this user's entries

  return (
    <main className="page">
      {location.state?.submitted && (
        <div className="card confirm-box">
          <div className="confirm-icon">✓</div>
          <h2>Thanks — your feedback is in.</h2>
          <p className="subtitle flush">The team will review it shortly. Track its status below.</p>
        </div>
      )}

      <div className="eyebrow">User Module</div>
      <h1>Your submitted feedback</h1>
      <p className="subtitle">Everything you've submitted, with its current status.</p>

      {items.length === 0 ? (
        <div className="card empty-state">You haven't submitted any feedback yet.</div>
      ) : (
        items.map((f) => (
          <div className="card list-card" key={f.id}>
            <div className="row-between">
              <div>
                <div className="eyebrow">{f.category} · {"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}</div>
                <p className="flush">{f.comment}</p>
              </div>
              <StatusBadge status={f.status} />
            </div>
          </div>
        ))
      )}
    </main>
  );
}
