"use client";

import "./StatsSection.css";
import { useState, useEffect } from "react";
import Image from "next/image";

import performanceGif from "../assets/images/PERFORMANCE.gif";
import seoGif from "../assets/images/SEO.gif";

function StatsSection() {
  const [salesCount, setSalesCount] = useState(0);
  const [percentageCount, setPercentageCount] = useState(0);
  const [countersStarted, setCountersStarted] = useState(false);

  const targetSales = 1089090523;
  const targetPercentage = 5126.28;

  useEffect(() => {
    const startDelay = setTimeout(() => {
      setCountersStarted(true);
    }, 100);

    return () => clearTimeout(startDelay);
  }, []);

  useEffect(() => {
    if (!countersStarted) return;

    let startTime = null;
    let animationFrame;

    const animateSales = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / 4000,
        1
      );

      const currentValue = Math.floor(
        progress * targetSales
      );

      setSalesCount(currentValue);

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animateSales);
      } else {
        setSalesCount(targetSales);
      }
    };

    let startTimePercent = null;
    let animationFramePercent;

    const animatePercentage = (timestamp) => {
      if (!startTimePercent)
        startTimePercent = timestamp;

      const progress = Math.min(
        (timestamp - startTimePercent) / 4000,
        1
      );

      const currentValue = (
        progress * targetPercentage
      ).toFixed(2);

      setPercentageCount(parseFloat(currentValue));

      if (progress < 1) {
        animationFramePercent =
          requestAnimationFrame(
            animatePercentage
          );
      } else {
        setPercentageCount(targetPercentage);
      }
    };

    animationFrame =
      requestAnimationFrame(animateSales);

    animationFramePercent =
      requestAnimationFrame(
        animatePercentage
      );

    return () => {
      if (animationFrame)
        cancelAnimationFrame(animationFrame);

      if (animationFramePercent)
        cancelAnimationFrame(
          animationFramePercent
        );
    };
  }, [countersStarted]);

  return (
    <section className="stats-section">
      <div className="container">

        <div className="stats-header">
          <h3>Your Satisfaction, Our Commitment</h3>
          <p>We Care About Our Customers</p>
        </div>

        <div className="stats-grid">

          <div className="card light-card">
            <Image
              src={performanceGif}
              alt="performance"
              width={500}
              height={500}
              unoptimized
            />
          </div>

          <div className="card dark-card">
            <h3>Potential Revenue Growth</h3>
            <span>
              Helping distributors and importers grow
              with reliable product availability,
              consistent quality, and dependable
              supply support.
            </span>
          </div>

          <div className="card dark-card">
            <h3>Optimal Performance</h3>
            <span>
              Delivering genuine-quality automotive
              spare parts with precise fitment,
              durability, and performance that
              match OEM quality and specifications.
            </span>
          </div>

          <div className="card light-card seo-card">
            <Image
              src={seoGif}
              alt="seo"
              width={500}
              height={500}
              unoptimized
            />

            {/*
            <div className="sales">
              <h4>
                Total Sales:
                <b>
                  ${salesCount.toLocaleString()}
                </b>
              </h4>
              <span className="growth">
                +{percentageCount}%
              </span>
            </div>
            */}
          </div>

        </div>
      </div>
    </section>
  );
}

export default StatsSection;