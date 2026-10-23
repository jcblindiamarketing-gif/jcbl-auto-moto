"use client";

import React from "react";
import Link from "next/link";
import "./CategorySection.css";

export default function CategorySection({
  categories = [],
  openCatalogue,
  hideCatalogueButton = false,
}) {
  // Display only these 8 categories in this order.
  const desiredCategories = [
    { slug: "car-spare-parts" },
    { slug: "chrome-parts" },
    { slug: "motorcycle-spare-parts" },
    {
      slug: "motorcycle-helmets",
      fallbackNames: ["Helmet", "Helmets", "Motorcycle Helmets"],
      displayName: "Helmet",
    },
    {
      fallbackNames: [
        "Three Wheeler Spare Parts",
        "Three Wheeler Parts",
      ],
      displayName: "Three Wheeler Spare Parts",
    },
    { slug: "heavy-machinery-parts" },
    { slug: "tractor-part" },
    { slug: "lubricants-engine-oil" },
  ];

  const normalize = (value) =>
    (value || "").toLowerCase().trim();

  // Match categories using their WordPress slugs or fallback names.
  const sortedCategories = desiredCategories
    .map((wanted) => {
      let category = wanted.slug
        ? categories.find(
            (cat) => normalize(cat?.slug) === wanted.slug
          )
        : undefined;

      if (!category && wanted.fallbackNames) {
        const names = wanted.fallbackNames.map(normalize);

        category = categories.find((cat) =>
          names.includes(normalize(cat?.name))
        );
      }

      if (!category) {
        console.warn(
          `[CategorySection] Category not found: ${
            wanted.displayName || wanted.slug
          }`
        );
        return null;
      }

      return {
        ...category,
        displayName: wanted.displayName || category.name,
      };
    })
    .filter(Boolean);

  const getShortDesc = (html) => {
    if (!html) return "Explore our products";

    const text = html.replace(/<[^>]+>/g, "").trim();
    const words = text.split(/\s+/).filter(Boolean);

    return words.length > 10
      ? words.slice(0, 10).join(" ") + "..."
      : text;
  };

  return (
    <section className="category-section container">
      <div className="category-container">
        <div className="category-header">
          <h2>Search By Category</h2>

          {!hideCatalogueButton && (
            <button
              type="button"
              onClick={openCatalogue}
              className="btn btn-blue"
            >
              Request a Catalogue
            </button>
          )}
        </div>

        <div className="categories-grid">
          {sortedCategories.map((cat) => {
            const slug = normalize(cat.slug);

            const imageUrl =
              cat?.image?.sourceUrl ||
              `/images/categories/${slug}.png`;

            return (
              <div
                key={cat.id || slug}
                className="category-card"
              >
                <div className="category-image">
                  <img
                    src={imageUrl}
                    alt={cat.displayName}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "/images/fallback.png";
                    }}
                  />
                </div>

                <h3 className="category-title">
                  {cat.displayName}
                </h3>

                <p className="category-description">
                  {getShortDesc(cat.description)}
                </p>

                <Link
                  href={`/category/${slug}`}
                  className="btn-blue btn"
                >
                  Inquire Now
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}