import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  // 🔥 Debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length >= 3) {
        fetchData();
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  // 🔥 API Call
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/students?search=${query}`
      );
      setResults(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 Highlight text
  const highlight = (text) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="highlight">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="container">
      <h1>Student Dashboard</h1>
      <p className="subtitle">Search for your ID</p>

      {/* 🔍 Search Box */}
      <div className="search-box">
        <span className="icon">🔍</span>
        <input
          type="text"
          placeholder="Search students..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
        />
      </div>

      {/* 🔽 Dropdown + No Results */}
      {query.length >= 3 && (
        <div className="dropdown">
          {results.length > 0 ? (
            results.map((s) => (
              <div
                key={s.rollNumber}
                className="item"
                onClick={() => {
                  setSelected(s);
                  setResults([]);
                }}
              >
                <div className="name">{highlight(s.name)}</div>
                <div className="details">
                  Class {s.class} • Roll {s.rollNumber}
                </div>
              </div>
            ))
          ) : (
            <div className="no-result">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}

      {/* 📄 Selected Student */}
      {selected && (
        <div className="card">
          <h2>{selected.name}</h2>
          <p>Class: {selected.class}</p>
          <p>Roll No: {selected.rollNumber}</p>
        </div>
      )}
    </div>
  );
}

export default App;