import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { addFeedback, getAllFeedback } from "../../lib/storage";
import { CATEGORIES } from "../../lib/constants";
import StarRating from "../../components/StarRating";
import PulseStrip from "../../components/PulseStrip";

export default function FeedbackForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const recent = getAllFeedback().slice(-20);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Please choose a star rating before submitting.");
      return;
    }
    addFeedback({
      customerName: name.trim(),
      submittedBy: user.username,
      category,
      rating,
      comment: comment.trim()
    });
    navigate("/my-feedback", { state: { submitted: true } });
  };

  return (
    <main className="page">
      <div className="eyebrow">User Module</div>
      <h1>Tell us what you think</h1>
      <p className="subtitle">Your feedback goes straight to the team that can act on it. Takes under a minute.</p>

      <PulseStrip items={recent} label="Recent pulse" />

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="customerName">Your name</label>
            <input id="customerName" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="" disabled>Choose a category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Rating</label>
            <StarRating value={rating} onChange={(n) => { setRating(n); setError(""); }} />
            <div className={"hint" + (error ? " error" : "")}>
              {error || (rating ? `${rating} out of 5 selected` : "Tap a star to rate.")}
            </div>
          </div>

          <div className="field">
            <label htmlFor="comment">Comments or suggestions</label>
            <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="What worked well? What could be better?" required />
          </div>

          <button type="submit" className="btn btn-primary">Submit feedback</button>
        </form>
      </div>
    </main>
  );
}
