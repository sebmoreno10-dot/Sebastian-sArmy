import React, { useState } from 'react';
import './App.css';

function App() {
  const [decision, setDecision] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision })
      });
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🤖 Decision Validator</h1>

      <div className="input-section">
        <textarea
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          placeholder="Describe your decision/strategy..."
          rows={4}
        />
        <button onClick={handleValidate} disabled={loading}>
          {loading ? 'Validating...' : 'Get Agent Feedback'}
        </button>
      </div>

      {feedback && (
        <div className="feedback-section">
          {Object.entries(feedback).map(([agent, data]) => (
            <div key={agent} className="agent-card">
              <h3>{agent}</h3>
              <p className="role">{data.role}</p>
              <div className="feedback-text">{data.feedback}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
