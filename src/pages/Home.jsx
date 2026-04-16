import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import BrandSection from "../components/BrandSection";
import AboutSection from "../components/AboutSection";
import StatsSection from "../components/StatsSection";
import TestimonialSection from "../components/TestimonialSection";
import Footer from "../components/Footer";
import WhyChooseUs from "../components/WhyChooseUs";
import PopularProductsSlider from "../components/PopularProductsSlider";
import GlobalNetwork from "../components/GlobalNetwork";
import FooterCTA from "../components/FooterCTA";
import RecentBlogs from "../components/RecentBlogs";

function Home() {
  return (
    <>
      <Hero />
       <BrandSection />
      <CategorySection />
      <AboutSection/>
      <StatsSection/>
      <TestimonialSection/>
      <WhyChooseUs/>
      <PopularProductsSlider/>
      <GlobalNetwork/>
      <RecentBlogs/>
     
    </>
  );
}

export default Home;