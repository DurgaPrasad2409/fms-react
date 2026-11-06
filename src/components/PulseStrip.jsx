/** Row of colored dots, one per recent rating: red (1-2), gold (3), teal (4-5). */
export default function PulseStrip({ items, label }) {
  return (
    <div className="pulse">
      <span className="pulse-label">{label}</span>
      {items.length === 0 ? (
        <span className="pulse-empty">No feedback yet.</span>
      ) : (
        items.map((f) => (
          <span
            key={f.id}
            className={"pulse-dot " + (f.rating <= 2 ? "low" : f.rating === 3 ? "mid" : "high")}
            title={`${f.rating} stars — ${f.category}`}
          />
        ))
      )}
    </div>
  );
}
