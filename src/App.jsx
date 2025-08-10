import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import { Routes, Route, Link } from 'react-router-dom';

function Foo(){
    return <h2>Foo Component</h2>;
}

export default function App() {
    const [status, setStatus] = useState(null);

    useEffect(() => {
      fetch(VS_DATA.rest_url, {
        headers: { 'X-WP-Nonce': VS_DATA.nonce }
      })
    .then(res => res.json())
    .then(setStatus);
  }, []);

  if (!status) return <p>Loading...</p>;

  return (
    <div id="vs-app">
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/foo">Foo</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/foo" element={<Foo />} />
      </Routes>
    </div>
  );
}
