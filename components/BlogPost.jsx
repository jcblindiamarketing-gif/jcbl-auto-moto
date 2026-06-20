"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumb from "./Breadcrumb";
import "./BlogPost.css";

const BlogPost = ({ slug }) => {
  const [post, setPost] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single blog post
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError("No blog post slug provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Try fetching by slug first
        let res = await fetch(
          `https://www.jcblautomoto.com/wp-json/wp/v2/posts?slug=${slug}&_embed&status=publish`
        );

        let data = await res.json();

        // If no post found with slug, try fetching all posts and find by slug
        if (data.length === 0) {
          console.log("No post found with slug, trying alternative fetch...");
          
          // Try to get post by post name (slug) using the posts endpoint
          res = await fetch(
            `https://www.jcblautomoto.com/wp-json/wp/v2/posts?per_page=100&_embed&status=publish`
          );
          data = await res.json();
          
          // Find the post with matching slug
          const foundPost = data.find(post => post.slug === slug);
          if (foundPost) {
            data = [foundPost];
          }
        }

        if (data.length === 0) {
          setError(`Blog post not found with slug: ${slug}`);
          setLoading(false);
          return;
        }

        const p = data[0];

        const cleanedContent = p.content.rendered
          .replace(/overflow\s*:\s*hidden/gi, "overflow:visible")
          .replace(/height\s*:\s*100vh/gi, "height:auto")
          .replace(/max-height\s*:\s*\d+px/gi, "max-height:none");

        setPost({ ...p, cleanedContent });
        console.log("Post loaded successfully:", p.title.rendered);
      } catch (e) {
        console.error("Error fetching blog post:", e);
        setError("Failed to load blog post. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Trigger resize after post loads
  useEffect(() => {
    if (post) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 300);
    }
  }, [post]);

  // Fetch latest blogs for sidebar
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(
          `https://www.jcblautomoto.com/wp-json/wp/v2/posts?per_page=3&_embed&status=publish`
        );
        const data = await res.json();
        setLatestPosts(data);
      } catch (e) {
        console.error("Error fetching latest posts:", e);
      }
    };

    fetchLatest();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <>
        <Breadcrumb title="Loading..." />
        <div className="container blog-layout">
          <div className="blog-main">
            <div className="img-skeleton"></div>
            <div className="text-skeleton title"></div>
            <div className="content-skeleton"></div>
            <div className="content-skeleton"></div>
          </div>
          <div className="blog-sidebar">
            <h3>Latest Blogs</h3>
            <div className="sidebar-skeleton"></div>
            <div className="sidebar-skeleton"></div>
            <div className="sidebar-skeleton"></div>
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (error || !post) {
    return (
      <>
        <Breadcrumb title="Blog Post Not Found" />
        <div className="container blog-layout">
          <div className="blog-main">
            <div className="error-container">
              <div className="error-icon">🔍</div>
              <h2>Blog Post Not Found</h2>
              <p>{error || "The blog post you're looking for doesn't exist or may have been removed."}</p>
              <Link href="/blog" className="back-to-blog-btn">
                ← Back to All Blogs
              </Link>
            </div>
          </div>
          <div className="blog-sidebar">
            <h3>Latest Blogs</h3>
            {latestPosts.length > 0 ? (
              latestPosts.map((item) => (
                <Link
                  href={`/blog/${item.slug}`}
                  key={item.id}
                  className="sidebar-item"
                >
                  <img
                    loading="lazy"
                    src={
                      item._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                      "https://via.placeholder.com/100"
                    }
                    alt={item.title.rendered}
                  />
                  <div>
                    <h4 dangerouslySetInnerHTML={{ __html: item.title.rendered }} />
                    <p>
                      {item.excerpt.rendered
                        .replace(/<[^>]+>/g, "")
                        .split(" ")
                        .slice(0, 6)
                        .join(" ")}
                      ...
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No latest posts available</p>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb
        title={post.title.rendered.replace(/<[^>]+>/g, "")}
      />

      <div className="container blog-layout">
        <div className="blog-main">
          {/* Featured Image */}
          {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
            <div className="blog-featured-image">
              <img
                loading="lazy"
                src={post._embedded["wp:featuredmedia"][0].source_url}
                alt={post.title.rendered}
                className="featured-image"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="blog-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

          {/* Meta Info */}
          <div className="blog-meta">
            <span className="blog-date">
              📅 {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {post._embedded?.author?.[0]?.name && (
              <span className="blog-author">
                ✍️ By {post._embedded.author[0].name}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="blog-content-wrapper">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{
                __html: post.cleanedContent,
              }}
            />
          </div>

          {/* Categories */}
          {post._embedded?.["wp:term"]?.[0] && (
            <div className="blog-categories">
              <h4>Categories:</h4>
              <div className="category-tags">
                {post._embedded["wp:term"][0].map((category) => (
                  <span key={category.id} className="category-tag">
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog Link */}
          <Link href="/blog" className="back-to-blog-bottom">
            ← Back to All Blogs
          </Link>
        </div>

        {/* Sidebar */}
        <div className="blog-sidebar">
          <div className="sidebar-widget">
            <h3>Latest Blogs</h3>
            {latestPosts.length > 0 ? (
              latestPosts.map((item) => (
                <Link
                  href={`/blog/${item.slug}`}
                  key={item.id}
                  className="sidebar-item"
                >
                  <img
                    loading="lazy"
                    src={
                      item._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                      "https://via.placeholder.com/100"
                    }
                    alt={item.title.rendered}
                  />
                  <div>
                    <h4 dangerouslySetInnerHTML={{ __html: item.title.rendered }} />
                    <p>
                      {item.excerpt.rendered
                        .replace(/<[^>]+>/g, "")
                        .split(" ")
                        .slice(0, 6)
                        .join(" ")}
                      ...
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p>Loading latest posts...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;