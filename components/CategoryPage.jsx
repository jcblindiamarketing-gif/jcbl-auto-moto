"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import "./CategoryPage.css";
import Loader from "../components/Loader";
import ContactForm from "../components/ContactForm";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import 'swiper/css';

const API_URL = "https://www.jcblautomoto.com/graphql";

// Skeleton Components
const CategoryCardSkeleton = () => (
  <div className="category-card skeleton">
    <div className="category-image skeleton-image"></div>
    <div className="skeleton-title"></div>
    <div className="skeleton-text"></div>
    <div className="skeleton-button"></div>
  </div>
);

const SubCategorySkeleton = () => (
  <div className="category-card skeleton">
    <div className="category-image skeleton-image"></div>
    <div className="skeleton-title"></div>
  </div>
);

const CategoryPageSkeleton = ({ type = 'subcategories' }) => {
  const skeletonCount = type === 'subcategories' ? 8 : 6;
  
  return (
    <section className="category-section-page new-sec">
      <div className="container">
        <div className="category-layout">
          <div className="category-main-content">
            <div className="category-header">
              <div className="skeleton skeleton-title-large"></div>
              <div className="skeleton skeleton-text-small"></div>
            </div>
            <div className="category-grid">
              {[...Array(skeletonCount)].map((_, index) => (
                type === 'subcategories' 
                  ? <SubCategorySkeleton key={index} />
                  : <CategoryCardSkeleton key={index} />
              ))}
            </div>
          </div>
          <aside className="category-sidebar">
            <div className="skeleton-sidebar">
              <div className="skeleton skeleton-title-medium"></div>
              <div className="skeleton skeleton-text-long"></div>
              <div className="skeleton skeleton-text-long"></div>
              <div className="skeleton skeleton-button"></div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

const CategoryPage = ({ slug }) => {
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoaded, setCategoryLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cursorStack, setCursorStack] = useState([null]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [categoryDescription, setCategoryDescription] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const limit = 10;

  // Use images from public folder - these are the correct paths
  const packagingImages = [
    "../assets/images/packaging_img_2.webp",
    "../assets/images/packaging_img_2.webp",
    "../assets/images/packaging_img_3.webp",
    "../assets/images/packaging_img_4.webp",
    "../assets/images/packaging_img_5.webp",
    "../assets/images/packaging_img_6.webp",
    "../assets/images/packaging_img_7.webp",
    "../assets/images/packaging_img_8.webp",
    "../assets/images/packaging_img_9.webp",
    "../assets/images/packaging_img_10.webp",
    "../assets/images/packaging_img_11.webp",
    "../assets/images/packaging_img_12.webp",
    "../assets/images/packaging_img_13.webp",
    "../assets/images/packaging_img_14.webp",
    "../assets/images/packaging_img_15.webp",
    "../assets/images/packaging_img_17.webp",
    "../assets/images/packaging_img_18.webp",
    "../assets/images/packaging_img_19.webp",
    "../assets/images/packaging_img_20.webp",
    "../assets/images/packaging_img_21.webp",
    "../assets/images/packaging_img_22.webp",
    "../assets/images/packaging_img_23.webp"
  ];

  // If no slug is provided, show a message
  if (!slug) {
    return (
      <section className="category-section-page New">
        <div className="container">
          <h1>All Categories</h1>
          <p>Please select a category</p>
        </div>
      </section>
    );
  }

  // Fetch category data
  useEffect(() => {
    setLoading(true);
    setCategoryLoaded(false);
    setIsFirstLoad(true);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        query GetCategory($slug: String!) {
          productCategories(where: { slug: [$slug] }) {
            nodes {
              id
              name
              slug
              description
              image {
                sourceUrl
              }
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
        variables: {
          slug: slug
        }
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const cat = res?.data?.productCategories?.nodes?.[0];
        console.log("FULL RESPONSE:", res);
        if (cat) {
          setCategoryName(cat.name);
          setCategoryDescription(cat.description || "");
          setSubCategories(cat.children?.nodes || []);
        } else {
          setCategoryName(slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
        }

        setCategoryLoaded(true);
        setLoading(false);
        setIsFirstLoad(false);
      })
      .catch(() => {
        setCategoryLoaded(true);
        setLoading(false);
        setIsFirstLoad(false);
      });
  }, [slug]);

  // Fetch products function
  const fetchProducts = (cursor = null, page = 1) => {
    setLoading(true);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        query GetProducts($slug: String!, $first: Int!, $after: String) {
          products(
            first: $first
            after: $after
            where: {
              category: $slug
              status: "publish"
            }
          ) {
            nodes {
              id
              name
              slug
              metaData {
                key
                value
              }
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
        variables: {
          slug: slug,
          first: limit,
          after: cursor
        }
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const data = res?.data?.products;

        setProducts(data?.nodes || []);
        setHasNextPage(data?.pageInfo?.hasNextPage || false);

        if (page === cursorStack.length) {
          setCursorStack((prev) => [
            ...prev,
            data?.pageInfo?.endCursor,
          ]);
        }

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // Fetch products when category is loaded and has no subcategories
  useEffect(() => {
    if (!categoryLoaded) return;

    if (subCategories.length === 0) {
      setProducts([]);
      setCurrentPage(1);
      setCursorStack([null]);
      fetchProducts(null, 1);
    }
  }, [categoryLoaded, subCategories, slug]);

  // Handle page change
  const handlePageChange = (page) => {
    const cursor = cursorStack[page - 1] || null;

    setCurrentPage(page);
    fetchProducts(cursor, page);

    window.scrollTo(0, 0);
  };

  // Show skeleton while loading (first load)
  if (isFirstLoad) {
    return <CategoryPageSkeleton type={subCategories.length > 0 ? 'subcategories' : 'products'} />;
  }

  // Show loader while pagination loading
  if (loading && !isFirstLoad && subCategories.length === 0) {
    return (
      <section className="category-section-page">
        <div className="container">
          <div className="category-layout">
            <div className="category-main-content">
              <div className="category-header">
                <h1 className="category-title">{categoryName}</h1>
                <p>Loading products...</p>
              </div>
              <div className="category-grid">
                {[...Array(6)].map((_, index) => (
                  <CategoryCardSkeleton key={index} />
                ))}
              </div>
            </div>
            <aside className="category-sidebar">
              <ContactForm />
            </aside>
          </div>
        </div>
      </section>
    );
  }

  // Show loader while loading
  if (loading && !categoryLoaded) {
    return (
      <div className="full-loader">
        <Loader />
      </div>
    );
  }

  // Show subcategories if they exist
  if (subCategories.length > 0) {
    return (
      <section className="category-section-page new-sec">
        <div className="container">
          <div className="category-layout">
            <div className="category-main-content">
              <div className="category-header">
                <h1 className="category-title">{categoryName}</h1>
                <p>{subCategories.length} Categories</p>
              </div>
              <div className="category-grid">
                {subCategories.map((cat) => (
                  <Link href={`/category/${cat.slug}`} key={cat.id}>
                    <div className="category-card">
                      <div className="category-image">
                        <img
                          loading="lazy"
                          decoding="async"
                          src={cat.image?.sourceUrl || "/images/fallback.png"}
                          alt={cat.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/fallback.png";
                          }}
                        />
                      </div>
                      <h4>{cat.name}</h4>
                    </div>
                  </Link>
                ))}
              </div>
              {categoryDescription && (
                <div
                  className="category-description"
                  dangerouslySetInnerHTML={{
                    __html: categoryDescription,
                  }}
                />
              )}
            </div>

            <aside className="category-sidebar">
              <ContactForm />
            </aside>
          </div>
        </div>
      </section>
    );
  }

  // Show products
  return (
    <section className="category-section-page">
      <div className="container">
        <div className="category-layout">
          <div className="category-main-content">
            <div className="category-header">
              <h1 className="category-title">{categoryName}</h1>
              <p>{products.length} Products</p>
            </div>

            <div className="category-grid">
              {products.map((product) => {
                const oemPartNumber = product?.metaData?.find(
                  item => item.key === "_custom_product_number_field"
                )?.value;

                const jcblPartNumber = product?.metaData?.find(
                  item => item.key === "_custom_product_text_field"
                )?.value;

                return (
                  <div className="category-card" key={product.id}>
                    <div className="category-image">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={product?.image?.sourceUrl || "/images/fallback.png"}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/fallback.png";
                        }}
                      />
                    </div>

                    <h4>{product.name}</h4>

                    {oemPartNumber && (
                      <p><strong>OEM:</strong> {oemPartNumber}</p>
                    )}

                    {jcblPartNumber && (
                      <p><strong>JCBL:</strong> {jcblPartNumber}</p>
                    )}

                    <Link href={`/product/${product.slug}`}>
                      <button className="btn-blue btn">
                        View Product
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>

            {products.length > 0 && (
              <div className="pagination modern">
                <button
                  className="page-nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <FaChevronLeft />
                </button>

                <span className="page-info">Page {currentPage}</span>

                <button
                  className="page-nav-btn"
                  disabled={!hasNextPage}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}

            <div className="packaging-slider-section">
              <h2 className="packaging-title">Packaging</h2>
              <Swiper
                modules={[Autoplay]}
                spaceBetween={0}
                slidesPerView={5}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop={true}
                className="simple-packaging-swiper"
                style={{ margin: 0, padding: 0 }}
              >
                {packagingImages.map((image, index) => (
                  <SwiperSlide key={index} style={{ margin: 0, padding: 0 }}>
                    <img
                      loading="lazy"
                      decoding="async"
                      src={image}
                      alt={`Packaging ${index + 1}`}
                      className="simple-packaging-image"
                      style={{ 
                        width: '100%', 
                        height: 'auto', 
                        display: 'block',
                        margin: 0,
                        padding: 0
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/fallback.png";
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            {categoryDescription && (
              <div
                className="category-description"
                dangerouslySetInnerHTML={{
                  __html: categoryDescription,
                }}
              />
            )}
          </div>

          <aside className="category-sidebar">
            <ContactForm />
          </aside>
        </div>
      </div>
    </section>
  );
};

export default CategoryPage;