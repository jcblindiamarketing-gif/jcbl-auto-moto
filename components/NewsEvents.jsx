"use client";
import React from "react";
import "./NewsEvents.css";
import Breadcrumb from "../components/Breadcrumb";

const NewsEvents = () => {
  // This URL is valid and will work as a poster image
  const videoPoster = "https://www.jcblautomoto.com/wp-content/uploads/2024/08/poster-video-mr-vindo.png";
  
  // !!! IMPORTANT: This URL returns a 404 error (file not found).
  // The video will not play until you replace this with a correct URL.
  // You can get a correct URL by uploading the video to your WordPress site's media library.
  const videoUrl = "https://www.jcblautomoto.com/wp-content/uploads/2024/08/jcbl-indiavideo.mp4"; 

  return (
    <section>
      <Breadcrumb title="News & Events" />
      <section className="news-events-section">
        <div className="container">
          <div className="news-events-wrapper">
            
            {/* Left Side Video */}
            <div className="video-side">
              <video
                className="news-video"
                poster={videoPoster} // The poster image will display correctly
                controls
                autoPlay
                muted
                loop
                // The 'onError' event will catch the 404 error and show a message to the user
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              >
                {/* This source URL is broken (404). Replace it with the correct one. */}
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* This message will appear if the video fails to load */}
              <div style={{ display: 'none', textAlign: 'center', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
                <p>⚠️ Video is currently unavailable. Please check back later.</p>
                <p style={{ fontSize: '14px', color: '#666' }}>The video file could not be found at the provided URL.</p>
              </div>
            </div>

            {/* Right Side Content */}
            <div className="content-side">
              <h3>JCBL Group :</h3>
              <h3>is a leading business conglomerate.</h3>
              <p>
                From an early foray into mobility solutions space to staying
                abreast of the latest technologies, JCBL Group today has a
                strong presence across diverse sectors of the economy such as
                automotive, construction & infrastructure, logistics, and
                healthcare.
              </p>
            </div>

          </div>
        </div>
      </section>
    </section>
  );
};

export default NewsEvents;