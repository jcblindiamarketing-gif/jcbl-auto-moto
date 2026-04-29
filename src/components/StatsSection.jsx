import "./StatsSection.css";
import { useState, useEffect } from "react";
import performanceGif from "../assets/images/PERFORMANCE.gif";
import seoGif from "../assets/images/SEO.gif";

function StatsSection() {
  const [salesCount, setSalesCount] = useState(0);
  const [percentageCount, setPercentageCount] = useState(0);
  const [countersStarted, setCountersStarted] = useState(false);

  const targetSales = 1089090523;
  const targetPercentage = 5126.28;

  // Start counters when component mounts
  useEffect(() => {
    // Small delay to ensure component is rendered
    const startDelay = setTimeout(() => {
      setCountersStarted(true);
    }, 100);

    return () => clearTimeout(startDelay);
  }, []);

  // Counter animation with slower speed
  useEffect(() => {
    if (!countersStarted) return;

    // Sales counter - slower animation (4 seconds instead of 2)
    let startTime = null;
    let animationFrame;
    
    const animateSales = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 4000, 1); // Changed to 4 seconds
      const currentValue = Math.floor(progress * targetSales);
      setSalesCount(currentValue);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateSales);
      } else {
        setSalesCount(targetSales);
      }
    };
    
    // Percentage counter - slower animation (4 seconds)
    let startTimePercent = null;
    let animationFramePercent;
    
    const animatePercentage = (timestamp) => {
      if (!startTimePercent) startTimePercent = timestamp;
      const progress = Math.min((timestamp - startTimePercent) / 4000, 1); // Changed to 4 seconds
      const currentValue = (progress * targetPercentage).toFixed(2);
      setPercentageCount(parseFloat(currentValue));
      
      if (progress < 1) {
        animationFramePercent = requestAnimationFrame(animatePercentage);
      } else {
        setPercentageCount(targetPercentage);
      }
    };
    
    animationFrame = requestAnimationFrame(animateSales);
    animationFramePercent = requestAnimationFrame(animatePercentage);
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (animationFramePercent) cancelAnimationFrame(animationFramePercent);
    };
  }, [countersStarted, targetSales, targetPercentage]);

  return (
    <section className="stats-section">
      <div className="container">

        {/* Heading */}
        <div className="stats-header">
          <h3>Your Satisfaction, Our Commitment</h3>
          <p>We Care About Our Customers</p>
        </div>

        {/* Grid */}
        <div className="stats-grid">

          {/* Top Left */}
          <div className="card light-card">
             <img src={performanceGif} alt="performance" />
          </div>

          {/* Top Right */}
          <div className="card dark-card">
            <h3>Create Performance</h3>
            <p>Optimal performance</p>
            <span>
              Ensure a smooth and efficient journey for your automotives,
              enhancing their overall experience.
            </span>
          </div>

          {/* Bottom Left */}
          <div className="card dark-card">
            <h3>Potential Revenue Growth</h3>
            <p>Driving Global Growth Through Export Innovation</p>
          </div>

          {/* Bottom Right - Counter Display */}
          <div className="card light-card seo-card">
            <img src={seoGif} alt="seo" />
            <div className="sales">
              <h4>Total Sales: <b>${salesCount.toLocaleString()}</b></h4>
              <span className="growth">+{percentageCount}%</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default StatsSection;