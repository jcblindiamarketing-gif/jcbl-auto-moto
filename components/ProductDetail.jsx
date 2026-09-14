
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
  const [activeImage, setActiveImage] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      setLoading(true);

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query GetProduct($slug: ID!) {
                product(id: $slug, idType: SLUG) {
                  id
                  name
                  description
                  seo {
                    title
                    metaDesc
                    canonical
                    opengraphTitle
                    opengraphDescription
                  }

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
            variables: {
              slug: slug,
            },
          }),
        });

        const result = await response.json();

        console.log("FULL RESPONSE 👉", result);

        if (result.errors) {
          console.error("GRAPHQL ERRORS 👉", result.errors);
        }

        const fetchedProduct = result?.data?.product;

        if (fetchedProduct) {
          console.log("PRODUCT 👉", fetchedProduct);

          console.log(
            "GALLERY 👉",
            fetchedProduct.galleryImages?.nodes
          );

          setProduct(fetchedProduct);
        } else {
          console.warn("NO PRODUCT FOUND");
          setProduct(null);
        }
      } catch (error) {
        console.error("GRAPHQL ERROR 👉", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Remove HTML tags for preview
  const getPreviewText = (html) => {
    if (!html) return "";

    const text = html.replace(/<[^>]+>/g, "");

    return text.slice(0, 150) + "...";
  };

  // Get featured image
  const featuredImage = product?.image?.sourceUrl || "";

  // Get gallery images
  const galleryImages = product?.galleryImages?.nodes || [];

  // Combine featured image + gallery images
  // Remove duplicate URLs
  const allImages = [
    featuredImage,
    ...galleryImages.map((image) => image.sourceUrl),
  ].filter(
    (url, index, array) =>
      url &&
      url.trim() !== "" &&
      array.indexOf(url) === index
  );

  // Current main image
  const currentImage = activeImage || allImages[0] || fallbackImg;

  // Change selected image
  const handleImageChange = (image, index) => {
    setActiveImage(image);
    setActiveImageIndex(index);
  };

  // Previous image
  const handlePreviousImage = () => {
    if (allImages.length === 0) return;

    const previousIndex =
      (activeImageIndex - 1 + allImages.length) %
      allImages.length;

    setActiveImageIndex(previousIndex);
    setActiveImage(allImages[previousIndex]);
  };

  // Next image
  const handleNextImage = () => {
    if (allImages.length === 0) return;

    const nextIndex =
      (activeImageIndex + 1) % allImages.length;

    setActiveImageIndex(nextIndex);
    setActiveImage(allImages[nextIndex]);
  };

  // Get custom metadata
  const oemPartNumber = product?.metaData?.find(
    (item) => item.key === "_custom_product_number_field"
  )?.value;

  const jcblPartNumber = product?.metaData?.find(
    (item) => item.key === "_custom_product_text_field"
  )?.value;

  const productDescription = product?.metaData?.find(
    (item) => item.key === "_wpt_field_description"
  )?.value;

  const productSpecifications = product?.metaData?.find(
    (item) => item.key === "_wpt_field_specifications"
  )?.value;

  return (
    <section className="product-detail">
      {loading ? (
        <div className="full-loader">
          <Loader />
        </div>
      ) : product ? (
        <div className="container">

          {/* Product Top Section */}

          <div className="product-detail-wrapper">

            {/* Product Images */}

            <div className="product-detail-image">

              {/* Main Image */}

              <div className="main-product-image">

                <img
                  src={currentImage}
                  alt={product?.name || "Product"}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImg;
                  }}
                />

                {/* Previous Button */}

                {allImages.length > 1 && (
                  <button
                    type="button"
                    className="image-nav prev"
                    onClick={handlePreviousImage}
                    aria-label="Previous image"
                  >
                    &#10094;
                  </button>
                )}

                {/* Next Button */}

                {allImages.length > 1 && (
                  <button
                    type="button"
                    className="image-nav next"
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    &#10095;
                  </button>
                )}

              </div>

              {/* Gallery Thumbnails */}

              {allImages.length > 0 && (
                <div className="product-detail-gallery">

                  {allImages.map((image, index) => (
                    <button
                      type="button"
                      className={`product-detail-gallery-item ${
                        activeImageIndex === index
                          ? "active"
                          : ""
                      }`}
                      key={`${image}-${index}`}
                      onClick={() =>
                        handleImageChange(image, index)
                      }
                      aria-label={`View product image ${
                        index + 1
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${
                          index + 1
                        }`}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </button>
                  ))}

                </div>
              )}

            </div>

            {/* Product Content */}

            <div className="product-detail-content">

              <h1>{product.name}</h1>

              {/* Part Numbers */}

              {(oemPartNumber || jcblPartNumber) && (
                <div className="part-numbers">

                  {oemPartNumber && (
                    <p>
                      <strong>OEM Part Number:</strong>{" "}
                      {oemPartNumber}
                    </p>
                  )}

                  {jcblPartNumber && (
                    <p>
                      <strong>JCBL Part Number:</strong>{" "}
                      {jcblPartNumber}
                    </p>
                  )}

                </div>
              )}

              {/* Short Description */}

              {product.shortDescription && (
                <div
                  className="short-desc"
                  dangerouslySetInnerHTML={{
                    __html: product.shortDescription,
                  }}
                />
              )}

              {/* Long Description Preview */}

              {product.description && (
                <p className="long-desc-preview">
                  {getPreviewText(product.description)}
                </p>
              )}

              {/* Inquire Button */}

              <Link href="/contact-us" className="btn-blue btn">
                Inquire Now
              </Link>

            </div>

          </div>

          {/* Product Tabs */}

          <div className="product-tabs">

            <div className="tabs-header">

              <button
                type="button"
                className={
                  activeTab === "description" ? "active" : ""
                }
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>

              <button
                type="button"
                className={
                  activeTab === "specs" ? "active" : ""
                }
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
                    __html:
                      productDescription ||
                      product.description ||
                      "<p>No description available</p>",
                  }}
                />
              )}

              {activeTab === "specs" && (
                <div
                  className="spec-table-wrapper"
                  dangerouslySetInnerHTML={{
                    __html:
                      productSpecifications ||
                      "<p>No specifications available</p>",
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