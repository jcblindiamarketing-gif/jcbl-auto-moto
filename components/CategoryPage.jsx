"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "./CategoryPage.css";
import Loader from "./Loader";
import ContactForm from "./ContactForm";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import "swiper/css";
import { usePathname } from "next/navigation";
import CategorySection from "./CategorySection";
const API_URL = "https://api.jcblautomoto.com/graphql";
const REQUEST_TIMEOUT = 15000;

// Products and subcategories per page
const PRODUCTS_PER_PAGE = 24;
const SUBCATEGORIES_PER_PAGE = 24;

const safeJsonResponse = async (response, label = "GraphQL") => {
  const rawText = await response.text();
  const text = rawText.trim();

  if (!response.ok) {
    console.error(`${label} HTTP error:`, response.status);
    return null;
  }

  if (!text || text.startsWith("<")) {
    console.error(`${label} returned invalid content`);
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error(`${label} JSON parse error:`, error);
    return null;
  }
};

const getImageUrl = (url) => {
  if (!url) return "";

  if (url.startsWith("https://api.jcblautomoto.com")) {
    return url.replace("https://api.jcblautomoto.com", "");
  }

  return url;
};

// --------------------------------------------------
// Skeleton components
// --------------------------------------------------

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

const CategoryPageSkeleton = ({ type = "subcategories" }) => {
  const skeletonCount = type === "subcategories" ? 8 : 6;

  return (
    <section className="category-section-page new-sec">
      <div className="container">
        <div className="category-layout">
          <div className="category-main-content">
            <div className="category-header"></div>

            <div className="category-grid">
              {[...Array(skeletonCount)].map((_, index) =>
                type === "subcategories" ? (
                  <SubCategorySkeleton key={index} />
                ) : (
                  <CategoryCardSkeleton key={index} />
                )
              )}
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

// --------------------------------------------------
// FAQ
// --------------------------------------------------

const FAQAccordion = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
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
            <div
              key={index}
              className={`faq-item ${isOpen ? "active" : ""}`}
            >
              <button
                className="faq-question"
                type="button"
                onClick={() => toggleFAQ(index)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  background: "#f8f9fa",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#1a1a2e",
                }}
              >
                <span className="faq-question-text">
                  {faq.question}
                </span>

                <span className="faq-icon">
                  {isOpen ? <FaMinus /> : <FaPlus />}
                </span>
              </button>

              {isOpen && (
                <div className="faq-answer">
                  <div
                    className="faq-answer-content"
                    dangerouslySetInnerHTML={{
                      __html: faq.answer,
                    }}
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

// --------------------------------------------------
// FAQ helpers
// --------------------------------------------------

const parseFAQsFromDescription = (description) => {
  if (!description) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(description, "text/html");

  const faqItems = doc.querySelectorAll(".faq-item");

  const items = [];

  faqItems.forEach((item) => {
    const questionEl = item.querySelector(".faq-question");
    const answerEl = item.querySelector(".faq-answer");

    if (questionEl && answerEl) {
      items.push({
        question: questionEl.textContent.trim(),
        answer: answerEl.innerHTML.trim(),
      });
    }
  });

  return items;
};

const removeFAQFromDescription = (description) => {
  if (!description) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(description, "text/html");

  const container = doc.querySelector(".faq-container");

  if (container) {
    container.remove();
    return doc.body.innerHTML;
  }

  return description;
};

// --------------------------------------------------
// Packaging slider
// --------------------------------------------------

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
          style={{
            margin: 0,
            padding: 0,
          }}
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
            <SwiperSlide
              key={index}
              style={{
                margin: 0,
                padding: 0,
              }}
            >
              <img
                loading="lazy"
                decoding="async"
                src={image}
                alt={`Packaging ${index + 1}`}
                className="simple-packaging-image"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  margin: 0,
                  padding: 0,
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

// --------------------------------------------------
// Main component
// --------------------------------------------------

/**
 * @param {{ slug?: string | null }} props
 */
const CategoryPage = ({ slug = null }) => {
  const pathname = usePathname();

  const allowedSlugsInOrder = [
    "car-spare-parts",
    "chrome-parts",
    "motorcycle-spare-parts",
    "motorcycle-helmets",
    "heavy-machinery-parts",
    "tractor-part",
    "lubricants-engine-oil",
    "car-alloy-wheels",
    "batteries",
  ];

  const effectiveSlug = slug || null;

  // --------------------------------------------------
  // Product state
  // --------------------------------------------------

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cursorStack, setCursorStack] = useState([null]);
  const [hasNextPage, setHasNextPage] = useState(false);

  // --------------------------------------------------
  // Category state
  // --------------------------------------------------

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] =
    useState("");

  // --------------------------------------------------
  // Subcategory state
  // --------------------------------------------------

  const [subCategories, setSubCategories] = useState([]);

  const [subCategoryPage, setSubCategoryPage] =
    useState(1);

  const [subCategoryCursorStack, setSubCategoryCursorStack] =
    useState([null]);

  const [subCategoryHasNextPage, setSubCategoryHasNextPage] =
    useState(false);

  const [subCategoryLoading, setSubCategoryLoading] =
    useState(false);

  // --------------------------------------------------
  // General state
  // --------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [categoryLoaded, setCategoryLoaded] =
    useState(false);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [faqData, setFaqData] = useState([]);

  const [descriptionWithoutFAQ, setDescriptionWithoutFAQ] =
    useState("");

  // --------------------------------------------------
  // All categories state
  // --------------------------------------------------

  const [allCategories, setAllCategories] = useState([]);
  const [isAllCategoriesView, setIsAllCategoriesView] =
    useState(false);

  // --------------------------------------------------
  // Packaging
  // --------------------------------------------------

  const packagingImages = [
    "/assets/images/packaging_img_2.webp",
    "/assets/images/packaging_img_3.webp",
    "/assets/images/packaging_img_4.webp",
    "/assets/images/packaging_img_5.webp",
    "/assets/images/packaging_img_6.webp",
    "/assets/images/packaging_img_7.webp",
    "/assets/images/packaging_img_8.webp",
    "/assets/images/packaging_img_9.webp",
    "/assets/images/packaging_img_10.webp",
    "/assets/images/packaging_img_11.webp",
    "/assets/images/packaging_img_12.webp",
    "/assets/images/packaging_img_13.webp",
    "/assets/images/packaging_img_14.webp",
    "/assets/images/packaging_img_15.webp",
    "/assets/images/packaging_img_17.webp",
    "/assets/images/packaging_img_18.webp",
    "/assets/images/packaging_img_19.webp",
    "/assets/images/packaging_img_20.webp",
    "/assets/images/packaging_img_21.webp",
    "/assets/images/packaging_img_22.webp",
    "/assets/images/packaging_img_23.webp",
  ];

  // --------------------------------------------------
  // Part number renderer
  // --------------------------------------------------

  const renderPartNumber = (label, value) => {
    if (!value) return null;

    const trimmed = value.trim();

    if (!trimmed) return null;

    if (trimmed.includes(" ")) {
      const parts = trimmed.split(" ").filter((p) => p);

      return (
        <p>
          <strong>{label}:</strong>{" "}
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

  // --------------------------------------------------
  // GraphQL helper
  // --------------------------------------------------

  const fetchGraphQL = async (
    query,
    variables = {},
    label = "GraphQL request",
    signal
  ) => {
    const startedAt = performance.now();

    const controller = new AbortController();

    const timeoutId = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT
    );

    const forwardAbort = () => controller.abort();

    if (signal) {
      if (signal.aborted) {
        controller.abort();
      } else {
        signal.addEventListener(
          "abort",
          forwardAbort,
          { once: true }
        );
      }
    }

    try {
      console.log(
        `[${label}] started`,
        variables
      );

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables,
        }),
        signal: controller.signal,
        cache: "no-store",
      });

      const json = await safeJsonResponse(
        response,
        label
      );

      console.log(
        `[${label}] finished in ${(
          (performance.now() - startedAt) /
          1000
        ).toFixed(2)}s`
      );

      return json;
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error(
          `[${label}] failed`,
          error
        );
      }

      return null;
    } finally {
      clearTimeout(timeoutId);

      if (signal) {
        signal.removeEventListener(
          "abort",
          forwardAbort
        );
      }
    }
  };

  // --------------------------------------------------
  // Fetch all categories
  // --------------------------------------------------

  const fetchAllCategories = async () => {
    setLoading(true);
    setIsAllCategoriesView(true);

    let allCategoriesFromWP = [];
    let hasNext = true;
    let after = null;

    try {
      while (hasNext) {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query GetAllCategories(
                $first: Int!
                $after: String
              ) {
                productCategories(
                  first: $first
                  after: $after
                  where: {
                    hideEmpty: false
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
              first: 100,
              after,
            },
          }),
        });

        const json = await safeJsonResponse(
          response,
          "All categories request"
        );

        const data =
          json?.data?.productCategories;

        const nodes = data?.nodes || [];

        allCategoriesFromWP = [
          ...allCategoriesFromWP,
          ...nodes,
        ];

        hasNext =
          Boolean(data?.pageInfo?.hasNextPage);

        after =
          data?.pageInfo?.endCursor || null;
      }

      console.log(
        "TOTAL WORDPRESS CATEGORIES:",
        allCategoriesFromWP.length
      );

      const filteredCategories =
        allCategoriesFromWP
          .filter((cat) => {
            const categorySlug =
              cat?.slug
                ?.toLowerCase()
                ?.trim();

            return allowedSlugsInOrder.includes(
              categorySlug
            );
          })
          .sort((a, b) => {
            const slugA =
              a?.slug
                ?.toLowerCase()
                ?.trim();

            const slugB =
              b?.slug
                ?.toLowerCase()
                ?.trim();

            return (
              allowedSlugsInOrder.indexOf(slugA) -
              allowedSlugsInOrder.indexOf(slugB)
            );
          });

      setAllCategories(filteredCategories);
      setLoading(false);
      setIsFirstLoad(false);
      setCategoryLoaded(true);
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error
      );

      setLoading(false);
      setIsFirstLoad(false);
      setCategoryLoaded(true);
    }
  };

  // --------------------------------------------------
  // No slug = All Categories
  // --------------------------------------------------

  useEffect(() => {
    if (!effectiveSlug) {
      fetchAllCategories();
    }
  }, [effectiveSlug]);

  // --------------------------------------------------
  // Load category information
  // --------------------------------------------------

  useEffect(() => {
    if (!effectiveSlug) return;

    const controller = new AbortController();

    let active = true;

    const loadCategory = async () => {
      setLoading(true);
      setCategoryLoaded(false);
      setIsFirstLoad(true);
      setIsAllCategoriesView(false);

      setProducts([]);
      setSubCategories([]);

      setCategoryName("");

      // Reset product pagination
      setCurrentPage(1);
      setCursorStack([null]);
      setHasNextPage(false);

      // Reset subcategory pagination
      setSubCategoryPage(1);
      setSubCategoryCursorStack([null]);
      setSubCategoryHasNextPage(false);

      const query = `
        query GetCategory(
          $slug: String!
          $childrenFirst: Int!
          $childrenAfter: String
        ) {
          productCategories(
            where: {
              slug: [$slug]
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

              children(
                first: $childrenFirst
                after: $childrenAfter
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
          }
        }
      `;

      const result = await fetchGraphQL(
        query,
        {
          slug: effectiveSlug,
          childrenFirst:
            SUBCATEGORIES_PER_PAGE,
          childrenAfter: null,
        },
        "Category request",
        controller.signal
      );

      if (!active) return;

      const cat =
        result?.data?.productCategories
          ?.nodes?.[0];

      if (cat) {
        const description =
          cat.description || "";

        setCategoryName(cat.name || "");

        setCategoryDescription(
          description
        );

        const children =
          cat.children;

        setSubCategories(
          children?.nodes || []
        );

        setSubCategoryHasNextPage(
          Boolean(
            children?.pageInfo
              ?.hasNextPage
          )
        );

        setSubCategoryCursorStack([
          null,
          children?.pageInfo?.endCursor ||
            null,
        ]);

        setFaqData(
          parseFAQsFromDescription(
            description
          )
        );

        setDescriptionWithoutFAQ(
          removeFAQFromDescription(
            description
          )
        );
      } else {
        setCategoryName(
          effectiveSlug
            .replace(/-/g, " ")
            .replace(
              /\b\w/g,
              (l) => l.toUpperCase()
            )
        );

        setSubCategories([]);
        setSubCategoryHasNextPage(false);
      }

      setCategoryLoaded(true);
      setLoading(false);
      setIsFirstLoad(false);
    };

    loadCategory();

    return () => {
      active = false;
      controller.abort();
    };
  }, [effectiveSlug]);

  // --------------------------------------------------
  // Fetch subcategories
  // --------------------------------------------------

  const fetchSubCategories = async (
    cursor = null,
    page = 1
  ) => {
    if (!effectiveSlug) return;

    setSubCategoryLoading(true);

    const controller =
      new AbortController();

    const query = `
      query GetSubCategories(
        $slug: String!
        $first: Int!
        $after: String
      ) {
        productCategories(
          where: {
            slug: [$slug]
          }
        ) {
          nodes {
            children(
              first: $first
              after: $after
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
        }
      }
    `;

    try {
      const result =
        await fetchGraphQL(
          query,
          {
            slug: effectiveSlug,
            first:
              SUBCATEGORIES_PER_PAGE,
            after: cursor,
          },
          "Subcategories request",
          controller.signal
        );

      const children =
        result?.data
          ?.productCategories
          ?.nodes?.[0]
          ?.children;

      if (!children) {
        setSubCategories([]);
        setSubCategoryHasNextPage(false);
        return;
      }

      setSubCategories(
        children.nodes || []
      );

      setSubCategoryHasNextPage(
        Boolean(
          children.pageInfo
            ?.hasNextPage
        )
      );

      setSubCategoryCursorStack(
        (previous) => {
          const updated = [
            ...previous,
          ];

          updated[page] =
            children.pageInfo
              ?.endCursor || null;

          return updated;
        }
      );
    } catch (error) {
      console.error(
        "Error fetching subcategories:",
        error
      );
    } finally {
      setSubCategoryLoading(false);
    }
  };

  // --------------------------------------------------
  // Subcategory pagination
  // --------------------------------------------------

  const handleSubCategoryPageChange = (
    page
  ) => {
    if (page < 1) return;

    const cursor =
      subCategoryCursorStack[
        page - 1
      ] || null;

    setSubCategoryPage(page);

    fetchSubCategories(
      cursor,
      page
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --------------------------------------------------
  // Fetch products
  // --------------------------------------------------

  const fetchProducts = async (
    cursor = null,
    page = 1,
    signal
  ) => {
    if (!effectiveSlug) return;

    setLoading(true);

    const query = `
      query GetProducts(
        $slug: String!
        $first: Int!
        $after: String
      ) {
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
    `;

    const result =
      await fetchGraphQL(
        query,
        {
          slug: effectiveSlug,
          first:
            PRODUCTS_PER_PAGE,
          after: cursor,
        },
        "Products request",
        signal
      );

    if (signal?.aborted) return;

    const data =
      result?.data?.products;

    if (!data) {
      setProducts([]);
      setHasNextPage(false);
      setLoading(false);
      return;
    }

    setProducts(
      data.nodes || []
    );

    setHasNextPage(
      Boolean(
        data.pageInfo?.hasNextPage
      )
    );

    setCursorStack(
      (previous) => {
        const updated = [
          ...previous,
        ];

        updated[page] =
          data.pageInfo?.endCursor ||
          null;

        return updated;
      }
    );

    setLoading(false);
  };

  // --------------------------------------------------
  // Fetch products only for leaf categories
  // --------------------------------------------------

  useEffect(() => {
    if (
      !categoryLoaded ||
      !effectiveSlug ||
      subCategories.length > 0
    ) {
      return;
    }

    const controller =
      new AbortController();

    setProducts([]);
    setCurrentPage(1);
    setCursorStack([null]);

    fetchProducts(
      null,
      1,
      controller.signal
    );

    return () =>
      controller.abort();
  }, [
    categoryLoaded,
    effectiveSlug,
    subCategories.length,
  ]);

  // --------------------------------------------------
  // Product pagination
  // --------------------------------------------------

  const handlePageChange = (
    page
  ) => {
    if (page < 1) return;

    const cursor =
      cursorStack[
        page - 1
      ] || null;

    setCurrentPage(page);

    fetchProducts(
      cursor,
      page
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --------------------------------------------------
  // Initial skeleton
  // --------------------------------------------------

  if (!effectiveSlug) {
    if (isFirstLoad || loading) {
      return (
        <CategoryPageSkeleton
          type="categories"
        />
      );
    }

    return (
      <>
        <section className="category-page-heading">
          <div className="container">
            <h1>All Categories</h1>
            <p>
              Explore our product
              categories
            </p>
          </div>
        </section>

        <CategorySection
          categories={allCategories}
          openCatalogue={() => {}}
          hideCatalogueButton={true}
        />
      </>
    );
  }

  // --------------------------------------------------
  // First load
  // --------------------------------------------------

  if (isFirstLoad) {
    return (
      <CategoryPageSkeleton
        type={
          subCategories.length > 0
            ? "subcategories"
            : "products"
        }
      />
    );
  }

  // --------------------------------------------------
  // Product loading
  // --------------------------------------------------

  if (
    loading &&
    !isFirstLoad &&
    subCategories.length === 0
  ) {
    return (
      <section className="category-section-page">
        <div className="container">
          <div className="category-layout">
            <div className="category-main-content">
              <div className="category-header">
                <h1 className="category-title">
                  {categoryName}
                </h1>

                <p>
                  Loading products...
                </p>
              </div>

              <div className="category-grid">
                {[...Array(6)].map(
                  (_, index) => (
                    <CategoryCardSkeleton
                      key={index}
                    />
                  )
                )}
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

  // --------------------------------------------------
  // SUBCATEGORY VIEW
  // --------------------------------------------------

  if (subCategories.length > 0) {
    return (
      <section className="category-section-page new-sec">
        <div className="container">
          <div className="category-layout">
            <div className="category-main-content">

              <div className="category-header">
                <h1 className="category-title">
                  {categoryName}
                </h1>

                <p>
                  {subCategories.length} Categories
                </p>
              </div>

              {subCategoryLoading ? (
                <div className="category-grid">
                  {[...Array(6)].map(
                    (_, index) => (
                      <SubCategorySkeleton
                        key={index}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="category-grid">
                  {subCategories.map(
                    (cat) => (
                      <div
                        className="category-card"
                        key={cat.id}
                      >
                        <div className="category-image">
                          <img
                            loading="lazy"
                            decoding="async"
                            src={
                              getImageUrl(
                                cat.image
                                  ?.sourceUrl
                              ) ||
                              "/images/fallback.png"
                            }
                            alt={cat.name}
                            onError={(e) => {
                              e.target.onerror =
                                null;

                              e.target.src =
                                "/images/fallback.png";
                            }}
                          />
                        </div>

                        <h4>
                          {cat.name}
                        </h4>

                        <Link
                          href={`${pathname}/${cat.slug}`}
                        >
                          <button
                            type="button"
                            className="btn btn-blue"
                          >
                            View Category
                          </button>
                        </Link>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* -------------------------------- */}
              {/* SUBCATEGORY PAGINATION */}
              {/* -------------------------------- */}

              {(subCategoryPage > 1 ||
                subCategoryHasNextPage) && (
                <div className="pagination modern">

                  <button
                    className="page-nav-btn"
                    disabled={
                      subCategoryPage === 1 ||
                      subCategoryLoading
                    }
                    onClick={() =>
                      handleSubCategoryPageChange(
                        subCategoryPage - 1
                      )
                    }
                  >
                    <FaChevronLeft />
                  </button>

                  <span className="page-info">
                    Page{" "}
                    {subCategoryPage}
                  </span>

                  <button
                    className="page-nav-btn"
                    disabled={
                      !subCategoryHasNextPage ||
                      subCategoryLoading
                    }
                    onClick={() =>
                      handleSubCategoryPageChange(
                        subCategoryPage + 1
                      )
                    }
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
                __html:
                  descriptionWithoutFAQ,
              }}
            />
          )}

          {faqData.length > 0 && (
            <FAQAccordion
              faqs={faqData}
            />
          )}

          <PackagingSlider
            images={packagingImages}
          />
        </div>
      </section>
    );
  }

  // --------------------------------------------------
  // PRODUCT VIEW
  // --------------------------------------------------

  return (
    <section className="category-section-page">
      <div className="container">
        <div className="category-layout">

          <div className="category-main-content">

            <div className="category-header">
              <h1 className="category-title">
                {categoryName}
              </h1>

              <p>
                {products.length} Products
              </p>
            </div>

            <div className="category-grid">

              {products.map(
                (product) => {
                  const oemPartNumber =
                    product?.metaData?.find(
                      (item) =>
                        item.key ===
                        "_custom_product_number_field"
                    )?.value;

                  const jcblPartNumber =
                    product?.metaData?.find(
                      (item) =>
                        item.key ===
                        "_custom_product_text_field"
                    )?.value;

                  return (
                    <div
                      className="category-card"
                      key={product.id}
                    >
                      <div className="category-image">
                        <img
                          loading="lazy"
                          decoding="async"
                          src={
                            getImageUrl(
                              product
                                ?.image
                                ?.sourceUrl
                            ) ||
                            "/images/fallback.png"
                          }
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror =
                              null;

                            e.target.src =
                              "/images/fallback.png";
                          }}
                        />
                      </div>

                      <h4>
                        {product.name}
                      </h4>

                      {renderPartNumber(
                        "OEM",
                        oemPartNumber
                      )}

                      {renderPartNumber(
                        "JCBL",
                        jcblPartNumber
                      )}

                      <Link
                        href={`/product/${product.slug}`}
                      >
                        <button
                          className="btn-blue btn"
                        >
                          View Product
                        </button>
                      </Link>
                    </div>
                  );
                }
              )}
            </div>

            {/* -------------------------------- */}
            {/* PRODUCT PAGINATION */}
            {/* -------------------------------- */}

            {products.length > 0 && (
              <div className="pagination modern">

                <button
                  className="page-nav-btn"
                  disabled={
                    currentPage === 1 ||
                    loading
                  }
                  onClick={() =>
                    handlePageChange(
                      currentPage - 1
                    )
                  }
                >
                  <FaChevronLeft />
                </button>

                <span className="page-info">
                  Page{" "}
                  {currentPage}
                </span>

                <button
                  className="page-nav-btn"
                  disabled={
                    !hasNextPage ||
                    loading
                  }
                  onClick={() =>
                    handlePageChange(
                      currentPage + 1
                    )
                  }
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
              __html:
                descriptionWithoutFAQ,
            }}
          />
        )}

        {faqData.length > 0 && (
          <FAQAccordion
            faqs={faqData}
          />
        )}

        <PackagingSlider
          images={packagingImages}
        />
      </div>
    </section>
  );
};

export default CategoryPage;