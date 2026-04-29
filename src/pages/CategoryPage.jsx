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
  const [subCategories, setSubCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoaded, setCategoryLoaded] = useState(false); // 🔥 FIX

  const [currentPage, setCurrentPage] = useState(1);
  const [cursorStack, setCursorStack] = useState([null]);
  const [hasNextPage, setHasNextPage] = useState(true);

  const limit = 10;

  // 🔥 HANDLE /category (no slug)
  if (!slug) {
    return (
      <section className="category-section-page">
        <div className="container">
          <h1>All Categories</h1>
          <p>Please select a category</p>
        </div>
      </section>
    );
  }

  // ✅ FETCH CATEGORY FIRST
  useEffect(() => {
    setLoading(true);
    setCategoryLoaded(false);

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
              children {
                nodes {
                  id
                  name
                  slug
                  image {
                    sourceUrl
                  }
                }
              }
            }
          }
        }
        `,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const cat = res?.data?.productCategories?.nodes?.[0];

        if (cat) {
          setCategoryName(cat.name);
          setSubCategories(cat.children?.nodes || []);
        }

        setCategoryLoaded(true); // 🔥 IMPORTANT
        setLoading(false);
      })
      .catch(() => {
        setCategoryLoaded(true);
        setLoading(false);
      });
  }, [slug]);

  // ✅ FETCH PRODUCTS ONLY AFTER CATEGORY CHECK
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

  // 🔥 FIXED LOGIC (NO FLICKER)
  useEffect(() => {
    if (!categoryLoaded) return;

    if (subCategories.length === 0) {
      setProducts([]);
      setCurrentPage(1);
      setCursorStack([null]);

      fetchProducts(null, 1);
    }
  }, [categoryLoaded, subCategories, slug]);

  // ✅ PAGINATION
  const handlePageChange = (page) => {
    const cursor = cursorStack[page - 1] || null;

    setCurrentPage(page);
    fetchProducts(cursor, page);

    window.scrollTo(0, 0);
  };

  // 🔥 LOADER
  if (loading) {
    return (
      <div className="full-loader">
        <Loader />
      </div>
    );
  }

  // 🔥 SHOW SUBCATEGORIES
  if (subCategories.length > 0) {
    return (
      <section className="category-section-page">
        <div className="container">

          <div className="category-header">
            <h1 className="category-title">{categoryName}</h1>
            <p>{subCategories.length} Categories</p>
          </div>

          <div className="category-grid">
            {subCategories.map((cat) => (
              <Link to={`/category/${cat.slug}`} key={cat.id}>
                <div className="category-card">
                  <div className="category-image">
                    <img
                      src={cat.image?.sourceUrl || "/images/fallback.png"}
                      alt={cat.name}
                    />
                  </div>
                  <h4>{cat.name}</h4>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>
    );
  }

  // 🔥 SHOW PRODUCTS
  return (
    <section className="category-section-page">
      <div className="container">

        <div className="category-header">
          <h1 className="category-title">{categoryName}</h1>
          <p>{products.length} Products</p>
        </div>

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
          <button
            className="page-nav-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <FaChevronLeft />
          </button>

          <span className="page-info">
            Page {currentPage}
          </span>

          <button
            className="page-nav-btn"
            disabled={!hasNextPage}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <FaChevronRight />
          </button>
        </div>

      </div>
    </section>
  );
};

export default CategoryPage;