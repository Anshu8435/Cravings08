import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'General question',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Thank you! Your message has been received by our support team.');
    setSubmitted(true);
    setFormData({ name: '', email: '', topic: 'General question', message: '' });
  };

  return (
    <main className="page-wrap wrap content-page">
      <div className="page-intro">
        <p className="eyebrow">CONTACT US</p>
        <h1>
          Let’s talk <em>food.</em>
        </h1>
        <p>
          Send a message to the Cravings team. Whether you're a hungry diner, a restaurateur, or a
          courier, we are here to help.
        </p>
      </div>

      <div className="form-card">
        <form className="stacked-form" onSubmit={handleSubmit}>
          <label>
            Your name
            <input
              name="name"
              required
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </label>

          <label>
            Email address
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </label>

          <label>
            What can we help with?
            <select
              name="topic"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            >
              <option>General question</option>
              <option>Restaurant partnership</option>
              <option>Delivery support</option>
              <option>Feedback</option>
            </select>
          </label>

          <label>
            Message
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Write your message…"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
          </label>

          <button className="button button-primary" type="submit">
            Send message
          </button>

          {submitted && (
            <p className="form-response" style={{ color: 'var(--green)', fontWeight: '600' }}>
              ✓ Thank you! We have received your inquiry and will respond within 24 hours.
            </p>
          )}
        </form>
      </div>
    </main>
  );
};

export default Contact;
