import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Feedback = () => {
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('Delivery experience');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comments.trim()) {
      toast.error('Please enter your feedback comments');
      return;
    }
    toast.success('Thank you for your rating and feedback!');
    setSubmitted(true);
    setComments('');
  };

  return (
    <main className="page-wrap wrap content-page">
      <div className="page-intro">
        <p className="eyebrow">CUSTOMER FEEDBACK</p>
        <h1>
          How was your <em>Cravings</em> experience?
        </h1>
        <p>
          Share a rating and a note with our team. Your feedback helps us champion better meals and
          faster delivery.
        </p>
      </div>

      <div className="form-card">
        <form className="stacked-form" onSubmit={handleSubmit}>
          <label>
            Feedback category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Delivery experience</option>
              <option>Restaurant or menu</option>
              <option>App experience</option>
              <option>Customer support</option>
              <option>Other</option>
            </select>
          </label>

          <fieldset className="star-field">
            <legend>Your rating</legend>
            <div className="star-picker" role="group" aria-label="Choose a rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={star <= rating ? 'is-selected' : ''}
                  onClick={() => setRating(star)}
                  aria-label={`${star} stars`}
                >
                  {star <= rating ? '★' : '☆'}
                </button>
              ))}
            </div>
          </fieldset>

          <label>
            Your comments
            <textarea
              name="comments"
              rows={4}
              placeholder="Tell us what went well or what we can improve…"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
            ></textarea>
          </label>

          <button type="submit" className="button button-primary">
            Submit feedback
          </button>

          {submitted && (
            <p className="form-response" style={{ color: 'var(--green)', fontWeight: '600' }}>
              ✓ We appreciate your feedback! It has been recorded.
            </p>
          )}
        </form>
      </div>
    </main>
  );
};

export default Feedback;
