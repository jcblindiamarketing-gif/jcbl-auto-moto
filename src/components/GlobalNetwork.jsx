import React from "react";
import "./GlobalNetwork.css";
import { FaGlobe, FaHeadset } from "react-icons/fa";
const GlobalNetwork = () => {
  const regions = [
    {
      title: "Africa",
      desc: "Consistent supply backed by strong distribution networks.",
    },
    {
      title: "Middle East",
      desc: "Optimized logistics for high-demand inventory cycles.",
    },
    {
      title: "Asia Pacific",
      desc: "Strategic sourcing with cost and supply efficiency.",
    },
    {
      title: "Latin America & Caribbean",
      desc: "Scalable export operations across multiple markets.",
    },
    {
      title: "Europe",
      desc: "Integrated trade routes linking Asia and Europe.",
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
              <p>ON-TIME GLOBAL DELIVERY</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default GlobalNetwork;