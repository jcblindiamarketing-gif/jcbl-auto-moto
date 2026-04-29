import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";
import Loader from "../components/Loader";
import fallbackImg from "../assets/images/logo-testimonial.png";
import { Link } from "react-router-dom";


const API_URL = "https://www.jcblautomoto.com/graphql";

const ProductDetail = () => {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    console.log("SLUG 👉", slug);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
body: JSON.stringify({
  query: `
  {
    products(
      where: { 
        slugIn: ["${slug}"], 
        status: "publish"
      }
    ) {
      nodes {
        id
        name
        description
        shortDescription

        ... on SimpleProduct {
          image {
            sourceUrl
          }
          galleryImages {
            nodes {
              sourceUrl
            }
          }
          attributes {
            nodes {
              name
              options
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
  console.log("FULL RESPONSE 👉", res);

  if (
    res &&
    res.data &&
    res.data.products &&
    res.data.products.nodes &&
    res.data.products.nodes.length > 0
  ) {
    setProduct(res.data.products.nodes[0]);
  } else {
    console.warn("NO PRODUCT FOUND IN RESPONSE");
    setProduct(null);
  }

  setLoading(false);
})
      .catch((err) => {
        console.error("GRAPHQL ERROR 👉", err);
        setLoading(false);
      });
  }, [slug]);

  const getPreviewText = (html) => {
    if (!html) return "";
    const text = html.replace(/<[^>]+>/g, "");
    return text.slice(0, 150) + "...";
  };

  const getImage = () => {
    const url = product?.image?.sourceUrl;
    return url && url.trim() !== "" ? url : fallbackImg;
  };

  return (
    <section className="product-detail">
      {loading ? (
        <div className="full-loader">
          <Loader />
        </div>
      ) : product ? (
        <div className="container">
          <div className="product-detail-wrapper">
            <div className="product-detail-image">
              <img
                src={getImage()}
                alt={product?.name || "product"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImg;
                }}
              />
            </div>

            <div className="product-detail-content">
              <h1>{product.name}</h1>

              {product.shortDescription && (
                <div
                  className="short-desc"
                  dangerouslySetInnerHTML={{
                    __html: product.shortDescription,
                  }}
                />
              )}

              {product.description && (
                <p className="long-desc-preview">
                  {getPreviewText(product.description)}
                </p>
              )}

       <Link to="/contact">
  <button className="btn-blue btn">Inquire Now</button>
</Link>
            </div>
          </div>

          <div className="product-tabs">
            <div className="tabs-header">
              <button
                className={activeTab === "description" ? "active" : ""}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>

              <button
                className={activeTab === "specs" ? "active" : ""}
                onClick={() => setActiveTab("specs")}
              >
                Specifications
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === "description" && (
                <div
                  className="product-description"
                  dangerouslySetInnerHTML={{
                    __html: product.description,
                  }}
                />
              )}

              {activeTab === "specs" && (
                <div className="spec-table-wrapper">
                  {product.attributes?.nodes?.length > 0 ? (
                    <table className="spec-table">
                      <tbody>
                        {product.attributes.nodes.map((attr, index) => (
                          <tr key={index}>
                            <td className="spec-name">{attr.name}</td>
                            <td className="spec-value">
                              {attr.options.join(", ")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No specifications available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="no-product">Product not found</p>
      )}
    </section>
  );
};

export default ProductDetail;