import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false); // 🔥 control dropdown

  const timerRef = useRef(null);
  const cacheRef = useRef({});
  const location = useLocation();

  // ✅ Get query from URL but DON'T auto search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setQuery(q);
    setResults([]); // ❗ clear results on page load
  }, [location.search]);

  const handleSearch = (value) => {
    setQuery(value);
    setActive(true); // show dropdown only when typing

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      if (value.length < 2) {
        setResults([]);
        return;
      }

      if (cacheRef.current[value]) {
        setResults(cacheRef.current[value]);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          `https://www.jcblautomoto.com/wp-json/wp/v2/product?search=${value}&per_page=5`
        );

        const data = await res.json();
        const finalData = Array.isArray(data) ? data : [];

        setResults(finalData);
        cacheRef.current[value] = finalData;

      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="search-box">

      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onFocus={() => setActive(true)}
          onBlur={() => setTimeout(() => setActive(false), 200)}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {loading && <div className="loader"></div>}
      </div>

      {/* ❗ ONLY SHOW WHEN ACTIVE */}
      {active && results.length > 0 && (
        <div className="search-results">

          <div className="search-title">Products</div>

          {results.map((item) => (
            <Link
              to={`/product/${item.slug}`}
              key={item.id}
              className="search-item"
              dangerouslySetInnerHTML={{
                __html: item.title.rendered,
              }}
            />
          ))}

    

        </div>
      )}
    </div>
  );
};

export default SearchBar;