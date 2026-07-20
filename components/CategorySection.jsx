"use client";

import React from "react";
import Link from "next/link";
import "./CategorySection.css";



export default function CategorySection({
  categories,
  openCatalogue
}) {
  // const [categories, setCategories] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const hasFetched = useRef(false);

  const allowedSlugsInOrder = [
    "car-spare-parts",
    "chrome-parts",
    "motorcycle-spare-parts",
    "motorcycle-helmets",
    "heavy-machinery-parts",
    "tractor-part",
    "lubricants-engine-oil",
    "batteries",
    "car-alloy-wheels",
  ];

  const externalUrls = {
    batteries: "https://jcblbatteries.com/",
  };

  const allowedSlugsSet = new Set(allowedSlugsInOrder);

  // useEffect(() => {
  //   if (hasFetched.current) return;
  //   hasFetched.current = true;

  //   const fetchAllCategories = async () => {
  //     let allCats = [];
  //     let hasNextPage = true;
  //     let after = null;

  //     try {
  //       while (hasNextPage) {
  //         const res = await fetch(API_URL, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             query: `
  //               query ($after: String) {
  //                 productCategories(
  //                   first: 100,
  //                   after: $after,
  //                   where: { hideEmpty: false }
  //                 ) {
  //                   nodes {
  //                     id
  //                     name
  //                     slug
  //                     description
  //                     image {
  //                       sourceUrl
  //                     }
  //                   }
  //                   pageInfo {
  //                     hasNextPage
  //                     endCursor
  //                   }
  //                 }
  //               }
  //             `,
  //             variables: { after },
  //           }),
  //         });

  //         const json = await res.json();
  //         const data = json?.data?.productCategories;

  //         allCats = [...allCats, ...(data?.nodes || [])];

  //         hasNextPage = data?.pageInfo?.hasNextPage;
  //         after = data?.pageInfo?.endCursor;
  //       }

  //       setCategories(allCats);
  //     } catch (err) {
  //       console.error("CATEGORY ERROR", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAllCategories();
  // }, []);

  const handleCategoryClick = (cat) => {
    const slug = cat?.slug?.toLowerCase()?.trim();

    if (externalUrls[slug]) {
      window.open(externalUrls[slug], "_blank");
    }
  };
console.log(
  categories.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
  }))
);
console.log(
  categories.find((c) => c.slug === "tractor-part")
);
  const sortedCategories = categories
    .filter((cat) => {
      const slug = cat?.slug?.toLowerCase()?.trim();
      return slug && allowedSlugsSet.has(slug);
    })
    .sort((a, b) => {
      const slugA = a?.slug?.toLowerCase()?.trim();
      const slugB = b?.slug?.toLowerCase()?.trim();

      return (
        allowedSlugsInOrder.indexOf(slugA) -
        allowedSlugsInOrder.indexOf(slugB)
      );
    });

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

       <div className="categories-grid">
  {sortedCategories.map((cat) => {
    const imageUrl =
      cat?.image?.sourceUrl ||
      `/images/categories/${cat.slug}.png`;

    const isExternal =
      externalUrls[cat.slug?.toLowerCase()?.trim()];

    return (
      <div key={cat.id} className="category-card">
        <div className="category-image">
          <img
            src={imageUrl}
            alt={cat.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/images/fallback.png";
            }}
          />
        </div>

        <h3 className="category-title">{cat.name}</h3>

        <p className="category-description">
          {getShortDesc(cat.description)}
        </p>

        {isExternal ? (
          <button
            onClick={() => handleCategoryClick(cat)}
            className=" btn-blue btn"
          >
            Visit Website
          </button>
        ) : (
          <Link
            href={`/category/${cat.slug}`}
            className=" btn-blue btn"
          >
            Inquire Now
          </Link>
        )}
      </div>
    );
  })}
</div>
      </div>
    </section>
  );
}