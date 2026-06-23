
"use client";
import React, { useEffect, useState } from "react";
import "./ProductDetail.css";
import Loader from "../components/Loader";
import fallbackImg from "../assets/images/logo-testimonial.png";
import Link from "next/link";


const API_URL = "https://api.jcblautomoto.com/graphql";

const ProductDetail = ({ slug }) => {

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
  product(id: "${slug}", idType: SLUG) {
    ... on SimpleProduct {
      id
      name
      description
      shortDescription

      metaData {
        key
        value
      }

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
  `,
}),
    })
      .then((res) => res.json())
     .then((res) => {
  console.log("FULL RESPONSE 👉", res);

if (
  res &&
  res.data &&
  res.data.product
) {
  console.log("PRODUCT", res.data.product);
  setProduct(res.data.product);
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
const oemPartNumber = product?.metaData?.find(
  item => item.key === "_custom_product_number_field"
)?.value;

const jcblPartNumber = product?.metaData?.find(
  item => item.key === "_custom_product_text_field"
)?.value;
const productDescription = product?.metaData?.find(
  item => item.key === "_wpt_field_description"
)?.value;

const productSpecifications = product?.metaData?.find(
  item => item.key === "_wpt_field_specifications"
)?.value;
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

{(oemPartNumber || jcblPartNumber) && (
  <div className="part-numbers">
    {oemPartNumber && (
      <p>
        <strong>OEM Part Number:</strong> {oemPartNumber}
      </p>
    )}

    {jcblPartNumber && (
      <p>
        <strong>JCBL Part Number:</strong> {jcblPartNumber}
      </p>
    )}
  </div>
)}

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

       <Link href="/contact">
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
      __html: productDescription || "<p>No description available</p>",
    }}
  />
)}

             {activeTab === "specs" && (
  <div
    className="spec-table-wrapper"
    dangerouslySetInnerHTML={{
      __html: productSpecifications || "<p>No specifications available</p>",
    }}
  />
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