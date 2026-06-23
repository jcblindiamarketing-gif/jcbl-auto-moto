"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    products: [],
    categories: [],
  });
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const timerRef = useRef(null);
  const cacheRef = useRef({});

  const handleSearch = (value) => {
    setQuery(value);
    setActive(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      if (value.trim().length < 2) {
        setResults({
          products: [],
          categories: [],
        });
        return;
      }

      if (cacheRef.current[value]) {
        setResults(cacheRef.current[value]);
        return;
      }

      try {
        setLoading(true);

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(
            `https://api.jcblautomoto.com/wp-json/wp/v2/product?search=${encodeURIComponent(
              value
            )}&per_page=20`
          ),
          fetch(
            `https://api.jcblautomoto.com/wp-json/wp/v2/product_cat?search=${encodeURIComponent(
              value
            )}&per_page=20`
          ),
        ]);

        const products = await productsRes.json();
        const categories = await categoriesRes.json();

        const keyword = value.toLowerCase().trim();

        const filteredProducts = Array.isArray(products)
          ? products.filter((item) =>
              item?.title?.rendered?.toLowerCase().includes(keyword)
            )
          : [];

        const filteredCategories = Array.isArray(categories)
          ? categories.filter((item) =>
              item?.name?.toLowerCase().includes(keyword)
            )
          : [];

        const finalData = {
          products: filteredProducts.slice(0, 5),
          categories: filteredCategories.slice(0, 5),
        };

        cacheRef.current[value] = finalData;
        setResults(finalData);
      } catch (error) {
        console.error(error);

        setResults({
          products: [],
          categories: [],
        });
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
          placeholder="Search..."
          value={query}
          onFocus={() => setActive(true)}
          onBlur={() => setTimeout(() => setActive(false), 200)}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {loading && <div className="loader" />}
      </div>

      {active &&
        (results.products.length > 0 ||
          results.categories.length > 0) && (
          <div className="search-results">
            {results.categories.length > 0 && (
              <>
                <div className="search-title">Categories</div>

                {results.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="search-item"
                  >
                    {cat.name}
                  </Link>
                ))}
              </>
            )}

            {results.products.length > 0 && (
              <>
                <div className="search-title">Products</div>

                {results.products.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    className="search-item"
                    dangerouslySetInnerHTML={{
                      __html: item.title.rendered,
                    }}
                  />
                ))}
              </>
            )}
          </div>
        )}
    </div>
  );
};

export default SearchBar;