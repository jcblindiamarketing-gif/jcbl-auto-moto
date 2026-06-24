"use client";
import { useState, useEffect } from "react";

import Hero from "./Hero";
import CategorySection from "./CategorySection";
import BrandSection from "./BrandSection";
import AboutSection from "./AboutSection";
import StatsSection from "./StatsSection";
import TestimonialSection from "./TestimonialSection";
import WhyChooseUs from "./WhyChooseUs";
import PopularProductsSlider from "./PopularProductsSlider";
import GlobalNetwork from "./GlobalNetwork";
import RecentBlogs from "./RecentBlogs";
import CatalogueForm from "./CatalogueForm";

function Home({ categories }) {  const [openForm, setOpenForm] = useState(false);

  const openCatalogue = () => setOpenForm(true);
  const closeCatalogue = () => setOpenForm(false);

  // 🔥 FIX 1: Recalculate scroll height (Lenis fix)
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // 🔥 FIX 2: Modal scroll lock (safe)
  useEffect(() => {
    document.body.style.overflow = openForm ? "hidden" : "auto";

    // recalc after modal open/close
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openForm]);

  return (
    <>
      <Hero openCatalogue={openCatalogue} />
      <BrandSection openCatalogue={openCatalogue} />
      <CategorySection
  categories={categories}
  openCatalogue={openCatalogue}
/>
      <AboutSection />
      <StatsSection />
      <TestimonialSection />
      <WhyChooseUs openCatalogue={openCatalogue}  />
      <PopularProductsSlider />
      <GlobalNetwork />
      <RecentBlogs />

      {openForm && (
        <div className="modal-overlay" onClick={closeCatalogue}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn-modal" onClick={closeCatalogue}>
              ✖
            </button>

            <h3 style={{ marginBottom: "15px" }}>
              Download Catalogue
            </h3>

            <CatalogueForm />
          </div>
        </div>
      )}
    </>
  );
}

export default Home;