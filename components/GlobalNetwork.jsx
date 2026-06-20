import React from "react";
import "./GlobalNetwork.css";
import { FaGlobe, FaHeadset } from "react-icons/fa";
const GlobalNetwork = () => {
  const regions = [
    {
      title: "Africa",
      desc: "Egypt, Algeria, Morocco, Tunisia, Angola, Mauritius, Seychelles",
    },
    {
      title: "Middle East",
      desc: "Saudi Arabia, Jordan, Lebanon, Turkey",
    },
    {
      title: "Asia Pacific",
      desc: "Sri Lanka, Cambodia, Vietnam, Philippines",
    },
    {
      title: "Latin America & Caribbean",
      desc: "Brazil, Peru, Colombia, Chile, Ecuador, Bolivia",
    },
    {
      title: "Europe",
      desc: "Strategic trade connectivity through Turkey",
    },
  ];

  return (
    <section className="network-section">
      <div className="container network-wrapper">

        {/* LEFT */}
        <div className="network-left">
          <span className="tag">OUR GLOBAL NETWORK</span>

          <h2>
            Connected Across <br />
            High <span>Growth Markets</span>
          </h2>

          <p>
            JCBL India powers a strong international supply chain across Asia,
            Africa, the Middle East, and Latin America, delivering high-quality
            automotive spare parts with speed, consistency, and reliability.
          </p>

        <div className="network-points">
  
  <div className="point-item">
    <div className="point-icon">
      <FaGlobe />
    </div>
    <div>
      <h4>Serving 24+ Countries</h4>
      <p>Extensive global distribution network</p>
    </div>
  </div>

  <div className="point-item">
    <div className="point-icon">
      <FaHeadset />
    </div>
    <div>
      <h4>Reliable Supply & Support</h4>
      <p>Assistance throughout purchase cycle & after sales support</p>
    </div>
  </div>

</div>
        </div>

        {/* RIGHT */}
        <div className="network-right">

          <div className="network-grid">
            {regions.map((item, index) => (
              <div className="network-card" key={index}>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>

                <div className="dots">
                  <span className="dot active"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            ))}

            {/* HIGHLIGHT CARD */}
            <div className="network-highlight">
              <h2>99.8%</h2>
              <p>Satisfied Customers</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default GlobalNetwork;