"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./BlogList.css";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const PER_PAGE = 9;
  const MAX_VISIBLE = 5;

  const startPage = Math.floor((page - 1) / MAX_VISIBLE) * MAX_VISIBLE + 1;
  const endPage = Math.min(startPage + MAX_VISIBLE - 1, totalPages);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `https://www.jcblautomoto.com/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&_embed`
        );

        const total = res.headers.get("X-WP-TotalPages");
        setTotalPages(Number(total));

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
      window.scrollTo(0, 0);
    };

    fetchBlogs();
  }, [page]);

  return (
    <div className="blog-list-container">
      <h2 className="blog-list-heading">All Blogs</h2>

      <div className="blog-list-grid">
        {loading
          ? [...Array(9)].map((_, i) => (
              <div className="blog-list-card skeleton" key={i}>
                <div className="skeleton-img"></div>
                <div className="skeleton-text title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
            ))
          : posts.map((post) => (
              <div className="blog-list-card" key={post.id}>
                <img
                  loading="lazy"
                  src={
                    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                    "https://via.placeholder.com/300"
                  }
                  alt={post.title.rendered}
                />

                <h3
                  dangerouslySetInnerHTML={{
                    __html: post.title.rendered,
                  }}
                />

                <p>
                  {post.excerpt.rendered
                    .replace(/<[^>]+>/g, "")
                    .slice(0, 120)}
                  ...
                </p>

                <Link href={`/blog/${post.slug}`} className="read-more-btn">
                  Read More
                </Link>
              </div>
            ))}
      </div>

      {!loading && (
        <div className="blog-list-pagination">
          {page > 1 && (
            <button onClick={() => setPage(page - 1)}>Prev</button>
          )}

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const pageNumber = startPage + i;

            return (
              <button
                key={pageNumber}
                className={page === pageNumber ? "active" : ""}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}

          {page < totalPages && (
            <button onClick={() => setPage(page + 1)}>Next</button>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogList;