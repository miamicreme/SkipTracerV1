import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [connection, setConnection] = useState('checking');
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(null);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/health');
        setConnection(res.ok ? 'live' : 'failed');
      } catch {
        setConnection('failed');
      }
    }
    check();
  }, []);

  const run = async () => {
    if (!query.trim()) {
      setResult('Please enter a query.');
      return;
    }
    const start = Date.now();
    setLoading(true);
    setTime(null);
    setResult('Loading...');
    try {
      const res = await fetch('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'NAME', query: { query } })
      });
      const text = await res.text();
      setResult(text);
    } catch (err) {
      setResult('Error: ' + err);
    } finally {
      setLoading(false);
      setTime(((Date.now() - start) / 1000).toFixed(2));
    }
  };

  return (
    <div className="dashboard">
      <header>
        <h2>SkipTracer</h2>
        <span className={connection === 'live' ? 'status live' : 'status dead'}>
          {connection === 'checking'
            ? 'Checking...'
            : connection === 'live'
              ? 'Connection live'
              : 'Connection failed'}
        </span>
      </header>
      <div className="main">
        <div className="query">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search phone, name or address"
          />
          <button onClick={run} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {time && <div className="timer">Time: {time}s</div>}
        <pre id="result">{result || 'Results here...'}</pre>
      </div>
    </div>
  );
}

export default App;
