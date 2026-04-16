import { useState } from "react";
import "../index.css";

import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import BrandSection from "../components/BrandSection";
import AboutSection from "../components/AboutSection";
import StatsSection from "../components/StatsSection";
import TestimonialSection from "../components/TestimonialSection";
import WhyChooseUs from "../components/WhyChooseUs";
import PopularProductsSlider from "../components/PopularProductsSlider";
import GlobalNetwork from "../components/GlobalNetwork";
import RecentBlogs from "../components/RecentBlogs";
import CatalogueForm from "../components/CatalogueForm";

function Home() {
  const [openForm, setOpenForm] = useState(false);

  const openCatalogue = () => setOpenForm(true);
  const closeCatalogue = () => setOpenForm(false);

  return (
    <>
      {/* 🔥 Pass function to components */}
      <Hero openCatalogue={openCatalogue} />
      <BrandSection openCatalogue={openCatalogue} />
      <CategorySection openCatalogue={openCatalogue} />
      <AboutSection />
      <StatsSection />
      <TestimonialSection />
      <WhyChooseUs />
      <PopularProductsSlider />
      <GlobalNetwork />
      <RecentBlogs />

      {/* 🔥 MODAL */}
      {openForm && (
        <div className="modal-overlay" onClick={closeCatalogue}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeCatalogue}>
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