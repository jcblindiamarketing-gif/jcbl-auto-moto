import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CategorySection.css";

const API_URL = "https://www.jcblautomoto.com/graphql";

function CategorySection({ openCatalogue }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        {
      productCategories(first: 100) {
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
                  description
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
        const rawCats = res?.data?.productCategories?.nodes || [];

        
  const allCats = rawCats;

        setCategories(allCats);
        setLoading(false);
      })
      .catch((err) => {
        console.error("CATEGORY ERROR 👉", err);
        setLoading(false);
      });
  }, []);

  // ✅ CORRECT SLUGS
 const allowedSlugs = [
  "batteries",
  "chrome-parts",
  "lubricants-engine-oil",
  "motorcycle-spare-parts",
  "motorcycle-helmets",
  "car-alloy-wheels",
  "heavy-machinery-parts",
  "tractor-part",      
  "car-spare-parts",     
];

  // ✅ FILTER
const filteredCategories = categories.filter((cat) => {
  const slug = cat?.slug?.toLowerCase()?.trim();

  return slug && allowedSlugs.includes(slug);
});

  console.log("FINAL FILTER 👉", filteredCategories);

  // ✅ DESCRIPTION LIMIT
  const getShortDesc = (html) => {
    if (!html) return "Explore our products";

    const text = html.replace(/<[^>]+>/g, "");
    const words = text.split(" ").filter(Boolean);

    return words.length > 10
      ? words.slice(0, 10).join(" ") + "..."
      : text;
  };

  return (
    <section className="category-section container">
      <div className="category-container">

        <div className="category-header">
          <h2>Search By Category</h2>

         <button onClick={openCatalogue} className="btn btn-blue">
  Download Catalogue
</button>
        </div>

        {loading ? (
          <div className="categories-grid">
            {[...Array(9)].map((_, i) => (
              <div className="category-card skeleton" key={i}></div>
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (

          <div className="categories-grid">
            {filteredCategories.map((cat) => {

              const imageUrl =
                cat?.image?.sourceUrl ||
                `/images/categories/${cat.slug}.png`;

              return (
                <div key={cat.id} className="category-card">

                  <div className="category-image">
                    <img
                      src={imageUrl}
                      alt={cat.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/fallback.png";
                      }}
                    />
                  </div>

                  <h3 className="category-title">{cat.name}</h3>

                  <p className="category-description">
                    {getShortDesc(cat.description)}
                  </p>

                  <Link
                    to={`/category/${cat.slug}`}
                    className="category-btn btn-blue btn"
                  >
                    Inquire Now
                  </Link>

                </div>
              );
            })}
          </div>

        ) : (
          <p style={{ textAlign: "center" }}>No categories found</p>
        )}

      </div>
    </section>
  );
}

export default CategorySection;