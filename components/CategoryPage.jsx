"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import "./CategoryPage.css";
import Loader from "../components/Loader";
import ContactForm from "../components/ContactForm";
import { FaChevronLeft, FaChevronRight, FaPlus, FaMinus } from "react-icons/fa";
import 'swiper/css';
import { usePathname } from "next/navigation";


const API_URL = "https://api.jcblautomoto.com/graphql";

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
              {/* <div className="skeleton skeleton-title-large"></div>
              <div className="skeleton skeleton-text-small"></div> */}
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

const FAQAccordion = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className="faq-accordion-section">
      <h3 className="faq-title">Frequently Asked Questions</h3>
      <div className="faq-accordion">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className={`faq-item ${isOpen ? 'active' : ''}`}>
              <button
                className="faq-question"
                type="button"
                onClick={() => toggleFAQ(index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: '#f8f9fa',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1a1a2e',
                }}
              >
                <span className="faq-question-text">{faq.question}</span>
                <span className="faq-icon">
                  {isOpen ? <FaMinus /> : <FaPlus />}
                </span>
              </button>
              {isOpen && (
                <div className="faq-answer">
                  <div
                    className="faq-answer-content"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Parse FAQ from description
const parseFAQsFromDescription = (description) => {
  if (!description) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(description, 'text/html');
  const faqItems = doc.querySelectorAll('.faq-item');
  const items = [];
  faqItems.forEach(item => {
    const questionEl = item.querySelector('.faq-question');
    const answerEl = item.querySelector('.faq-answer');
    if (questionEl && answerEl) {
      items.push({
        question: questionEl.textContent.trim(),
        answer: answerEl.innerHTML.trim()
      });
    }
  });
  return items;
};

// Remove FAQ container from description
const removeFAQFromDescription = (description) => {
  if (!description) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(description, 'text/html');
  const container = doc.querySelector('.faq-container');
  if (container) {
    container.remove();
    return doc.body.innerHTML;
  }
  return description;
};

// Packaging Slider Component
const PackagingSlider = ({ images }) => {
  return (
    <div className="full-width-packaging-section">
      <div className="packaging-slider-wrapper">
        <div className="packaging-title-container">
          <h2 className="packaging-title">Packaging</h2>
        </div>
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
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 0,
            },
          }}
        >
          {images.map((image, index) => (
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
    </div>
  );
};

// Main CategoryPage Component
const CategoryPage = ({ slug = null }) => {
    const pathname = usePathname();
  // Ensure slug is properly handled
  const effectiveSlug = slug || null;
  
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
  const [faqData, setFaqData] = useState([]);
  const [descriptionWithoutFAQ, setDescriptionWithoutFAQ] = useState("");
  
  // States for "All Categories" view
  const [allCategories, setAllCategories] = useState([]);
  const [isAllCategoriesView, setIsAllCategoriesView] = useState(false);
  const [allCategoriesPage, setAllCategoriesPage] = useState(1);
  const [allCategoriesCursorStack, setAllCategoriesCursorStack] = useState([null]);
  const [allCategoriesHasNext, setAllCategoriesHasNext] = useState(true);

  const limit = 10;

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

  // Helper function to render part numbers
  const renderPartNumber = (label, value) => {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;

    if (trimmed.includes(' ')) {
      const parts = trimmed.split(' ').filter(p => p);
      return (
        <p>
          <strong>{label}:</strong>{' '}
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {index > 0 && <br />}
              {part}
            </React.Fragment>
          ))}
        </p>
      );
    }

    return (
      <p>
        <strong>{label}:</strong> {trimmed}
      </p>
    );
  };

  // Fetch all categories (for the "All Categories" view)
  const fetchAllCategories = (cursor = null, page = 1) => {
    setLoading(true);
    setIsAllCategoriesView(true);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        query GetAllCategories($first: Int!, $after: String) {
          productCategories(
            first: $first
            after: $after
            where: { 
              parent: 0,
              hideEmpty: true
            }
          ) {
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
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
        `,
        variables: {
          first: limit,
          after: cursor
        }
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const data = res?.data?.productCategories;
        const categoriesData = data?.nodes || [];
        
        setAllCategories(categoriesData);
        setAllCategoriesHasNext(data?.pageInfo?.hasNextPage || false);

        if (page === allCategoriesCursorStack.length) {
          setAllCategoriesCursorStack((prev) => [
            ...prev,
            data?.pageInfo?.endCursor,
          ]);
        }

        setLoading(false);
        setIsFirstLoad(false);
        setCategoryLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
        setIsFirstLoad(false);
        setCategoryLoaded(true);
      });
  };

  // Handle "All Categories" page change
  const handleAllCategoriesPageChange = (page) => {
    const cursor = allCategoriesCursorStack[page - 1] || null;
    setAllCategoriesPage(page);
    fetchAllCategories(cursor, page);
    window.scrollTo(0, 0);
  };

  // If no slug is provided, show all categories
  useEffect(() => {
    if (!effectiveSlug) {
      fetchAllCategories(null, 1);
    }
  }, [effectiveSlug]);

  // Show skeleton while loading for all categories
  if (!effectiveSlug) {
    if (isFirstLoad || loading) {
      return (
        <section className="category-section-page">
          <div className="container">
            <div className="category-layout">
              <div className="category-main-content">
                <div className="category-header">
                  <h1 className="category-title">All Categories</h1>
                  <p className="category-subtitle">Loading categories...</p>
                </div>
                <div className="category-grid">
                  {[...Array(10)].map((_, index) => (
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

    // Render all categories
    return (
      <section className="category-section-page">
        <div className="container">
          <div className="category-layout">
            <div className="category-main-content">
              <div className="category-header">
                <h1 className="category-title">All Categories</h1>
                <p className="category-subtitle">
                  {allCategories.length} Categories Available
                </p>
              </div>

              <div className="category-grid">
                {allCategories.map((category) => (
                  <Link href={`/category/${category.slug}`} key={category.id}>
                    <div className="category-card">
                      <div className="category-image">
                        <img
                          loading="lazy"
                          decoding="async"
                          src={category.image?.sourceUrl || "/images/fallback.png"}
                          alt={category.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/fallback.png";
                          }}
                        />
                      </div>
                     <Link href={`/category/${category.slug}`}>
 
    <h4>{category.name} </h4>
 
</Link>
                      {category.children?.nodes?.length > 0 && (
                        <p className="subcategory-count">
                          {category.children.nodes.length} Subcategories
                        </p>
                      )}
                      <button className="btn-blue btn view-btn">
                        View Category
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination for All Categories */}
              {allCategories.length > 0 && (
                <div className="pagination modern">
                  <button
                    className="page-nav-btn"
                    disabled={allCategoriesPage === 1}
                    onClick={() => handleAllCategoriesPageChange(allCategoriesPage - 1)}
                  >
                    <FaChevronLeft />
                  </button>

                  <span className="page-info">Page {allCategoriesPage}</span>

                  <button
                    className="page-nav-btn"
                    disabled={!allCategoriesHasNext}
                    onClick={() => handleAllCategoriesPageChange(allCategoriesPage + 1)}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </div>

            <aside className="category-sidebar">
              <ContactForm />
            </aside>
          </div>

          {/* Packaging Slider */}
          <PackagingSlider images={packagingImages} />
        </div>
      </section>
    );
  }

  // ============================================
  // EXISTING CATEGORY VIEW CODE (with slug)
  // ============================================

  // Fetch category data
  useEffect(() => {
    if (!effectiveSlug) return;
    
    setLoading(true);
    setCategoryLoaded(false);
    setIsFirstLoad(true);
    setIsAllCategoriesView(false);

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
          slug: effectiveSlug
        }
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const cat = res?.data?.productCategories?.nodes?.[0];
        if (cat) {
          setCategoryName(cat.name);
          const description = cat.description || "";
          setCategoryDescription(description);
          
          const parsedFAQs = parseFAQsFromDescription(description);
          setFaqData(parsedFAQs);
          setDescriptionWithoutFAQ(removeFAQFromDescription(description));
          setSubCategories(cat.children?.nodes || []);
        } else {
          setCategoryName(effectiveSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
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
  }, [effectiveSlug]);

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
          slug: effectiveSlug,
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
    if (!categoryLoaded || !effectiveSlug) return;

    if (subCategories.length === 0) {
      setProducts([]);
      setCurrentPage(1);
      setCursorStack([null]);
      fetchProducts(null, 1);
    }
  }, [categoryLoaded, subCategories, effectiveSlug]);

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
             <div className="category-card" key={cat.id}>
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

  <Link href={`${pathname}/${cat.slug}`}>
    <button type="button" className="btn btn-blue">
      View Category
    </button>
  </Link>
</div>
                ))}
              </div>
              
         
              
        
            </div>

            <aside className="category-sidebar">
              <ContactForm />
            </aside>
          </div>
               {descriptionWithoutFAQ && (
                <div
                  className="category-description"
                  dangerouslySetInnerHTML={{
                    __html: descriptionWithoutFAQ,
                  }}
                />
              )}
                    {faqData.length > 0 && <FAQAccordion faqs={faqData} />}
          <PackagingSlider images={packagingImages} />
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
                    {renderPartNumber('OEM', oemPartNumber)}
                    {renderPartNumber('JCBL', jcblPartNumber)}

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
            
          
          </div>

          <aside className="category-sidebar">
            <ContactForm />
          </aside>
        </div>
          {descriptionWithoutFAQ && (
              <div
                className="category-description"
                dangerouslySetInnerHTML={{
                  __html: descriptionWithoutFAQ,
                }}
              />
            )}
            
            {faqData.length > 0 && <FAQAccordion faqs={faqData} />}
        <PackagingSlider images={packagingImages} />
      </div>
    </section>
  );
};

export default CategoryPage;