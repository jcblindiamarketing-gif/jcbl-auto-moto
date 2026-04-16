import "./StatsSection.css";

import performanceGif from "../assets/images/PERFORMANCE.gif";
import seoGif from "../assets/images/SEO.gif";

function StatsSection() {
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

          {/* Bottom Right */}
          <div className="card light-card seo-card">
            <img src={seoGif} alt="seo" />
            {/* <div className="sales">
              <h4>Total Sales: <b>$33,523</b></h4>
              <span className="growth">+152.28%</span>
            </div> */}
          </div>

        </div>

      </div>
    </section>
  );
}

export default StatsSection;