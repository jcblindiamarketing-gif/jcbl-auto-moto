  import React, { useEffect, useState } from "react";
  import { useParams, Link } from "react-router-dom";
  import "./CategoryPage.css";
  import Loader from "../components/Loader";
  import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
  const API_URL = "https://www.jcblautomoto.com/graphql";

  const CategoryPage = () => {
    const { slug } = useParams();

    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [cursorStack, setCursorStack] = useState([null]);
    const [hasNextPage, setHasNextPage] = useState(true);

    const limit = 10;

    // ✅ FETCH CATEGORY NAME (ONLY ONCE)
    useEffect(() => {
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          {
            productCategories(where: { slug: "${slug}" }) {
              nodes {
                name
              }
            }
          }
          `,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          const categoryData = res?.data?.productCategories?.nodes?.[0];
          if (categoryData) {
            setCategoryName(categoryData.name);
          }
        });
    }, [slug]);

    // ✅ FAST PRODUCT FETCH
    const fetchProducts = (cursor = null, page = 1) => {
      setLoading(true);

      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          {
            products(
              first: ${limit}
              where: {
                category: "${slug}"
                status: "publish"
              }
              ${cursor ? `after: "${cursor}"` : ""}
            ) {
              nodes {
                id
                name
                slug
                image {
                  sourceUrl
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
          `,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          const data = res?.data?.products;

          setProducts(data?.nodes || []);
          setHasNextPage(data?.pageInfo?.hasNextPage);

          if (page === cursorStack.length) {
            setCursorStack((prev) => [
              ...prev,
              data?.pageInfo?.endCursor,
            ]);
          }

          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    // ✅ FIRST LOAD
    useEffect(() => {
      setProducts([]);
      setCurrentPage(1);
      setCursorStack([null]);

      fetchProducts(null, 1);
    }, [slug]);

    // ✅ PAGE CHANGE
    const handlePageChange = (page) => {
      const cursor = cursorStack[page - 1] || null;

      setCurrentPage(page);
      fetchProducts(cursor, page);

      window.scrollTo(0, 0);
    };

    return (
      <section className="category-section-page">
        <div className="container">

          {/* HEADER */}
          <div className="category-header">
            <h1 className="category-title">
              {categoryName || "Loading..."}
            </h1>
            <p>{products.length} Products</p>
          </div>

          {/* PRODUCTS */}
          {loading ? (
            <div className="full-loader">
              <Loader />
            </div>
          ) : (
            <>
              <div className="category-grid">
                {products.map((product) => (
                  <div className="category-card" key={product.id}>
                    <div className="category-image">
                      <img
                        src={
                          product?.image?.sourceUrl ||
                          "/images/fallback.png"
                        }
                        alt={product.name}
                      />
                    </div>

                    <h4>{product.name}</h4>

                    <Link to={`/product/${product.slug}`}>
                      <button className="btn-blue btn">
                        View Product
                      </button>
                    </Link>
                  </div>
                ))}
              </div>

            <div className="pagination modern">

    {/* PREV */}
    <button
      className="page-nav-btn"
      disabled={currentPage === 1}
      onClick={() => handlePageChange(currentPage - 1)}
    >
      <FaChevronLeft />
    </button>

    {/* PAGE NUMBER */}
    <span className="page-info">
      Page {currentPage}
    </span>

    {/* NEXT */}
    <button
      className="page-nav-btn"
      disabled={!hasNextPage}
      onClick={() => handlePageChange(currentPage + 1)}
    >
      <FaChevronRight />
    </button>

  </div>
            </>
          )}
        </div>
      </section>
    );
  };

  export default CategoryPage;