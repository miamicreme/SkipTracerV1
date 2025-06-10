import { useState } from 'react';
import './App.css';

function App() {
  const [mode, setMode] = useState('PHONE');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');

  const run = async () => {
    if (!query.trim()) {
      setResult('Please enter a query.');
      return;
    }
    setResult('Loading...');
    try {
      const res = await fetch('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, query: { query } })
      });
      const text = await res.text();
      setResult(text);
    } catch (err) {
      setResult('Error: ' + err);
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>SkipTracer</h2>
        <button
          className={`mode-btn ${mode === 'PHONE' ? 'active' : ''}`}
          onClick={() => setMode('PHONE')}
        >
          PHONE
        </button>
        <button
          className={`mode-btn ${mode === 'NAME' ? 'active' : ''}`}
          onClick={() => setMode('NAME')}
        >
          NAME
        </button>
        <button
          className={`mode-btn ${mode === 'ADDR' ? 'active' : ''}`}
          onClick={() => setMode('ADDR')}
        >
          ADDR
        </button>
      </div>
      <div className="main">
        <h1>API Dashboard</h1>
        <div className="query">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter phone, name or address"
          />
          <button onClick={run}>{mode}</button>
        </div>
        <pre id="result">{result || 'Results here...'}</pre>
      </div>
    </div>
  );
}

export default App;
