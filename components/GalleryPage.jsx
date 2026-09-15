import React, { useState } from "react";
import EventList from "../components/EventList";
import Gallery from "../components/Gallery";
import Breadcrumb from "../components/Breadcrumb";
import "./GalleryPage.css";

const eventData = [
  {
    name: "GLIMPSES OF AUTOMECHANICA DUBAI 2022",
    imageCount: 22,
    getImagePath: (i) =>
      `/images/GLIMPSES OF AUTOMECHANICA DUBAI 2022/AUTOMECHANI-A-DUBAI-2022-img-${i}.jpeg`,
  },
  {
    name: "GLIMPSES OF AUTOMEC BRAZIL 2023",
    imageCount: 8,
    getImagePath: (i) =>
      `/images/GLIMPSES OF AUTOMEC BRAZIL 2023/AUTOMEC-BRAZIL-2023-img-${i}.jpeg`,
  },
  {
    name: "GLIMPSE-OF-AUTOMECHANIKA-DUBAI-2023",
    imageCount: 30,
    getImagePath: (i) =>
      `/images/GLIMPSE-OF-AUTOMECHANIKA-DUBAI-2023/IMG_dubai_${i}.jpeg`,
  },
  {
    name: "AUTOMECHANIKA-HO-CHI-MINH CITY 2023",
    imageCount: 24,
    getImagePath: (i) =>
      `/images/AUTOMECHANIKA-HO-CHI-MINH CITY 2023/AUTOMECHANIKA-HO-CHI-MINH-img-${i}.jpeg`,
  },
];

const createEventImages = (event) => {
  return Array.from({ length: event.imageCount }, (_, index) =>
    event.getImagePath(index + 1)
  );
};

const events = eventData.map((event) => ({
  ...event,
  images: createEventImages(event),
  count: event.imageCount,
}));

// Preload the first image of every tab in the background
const preloadFirstImages = () => {
  events.forEach((event) => {
    const image = new Image();
    image.src = event.images[0];
  });
};

preloadFirstImages();

const GalleryPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(events[0]?.name || "");
  const [currentImages, setCurrentImages] = useState(
    events[0]?.images || []
  );
  const [isChanging, setIsChanging] = useState(false);

  const handleEventSelect = (eventName) => {
    if (eventName === selectedEvent) return;

    const event = events.find((item) => item.name === eventName);

    if (!event) return;

    // Change tab immediately
    setSelectedEvent(event.name);
    setCurrentImages(event.images);

    // Only show a lightweight loading state if needed
    setIsChanging(true);

    const firstImage = new Image();
    firstImage.src = event.images[0];

    firstImage.onload = () => {
      setIsChanging(false);
    };

    firstImage.onerror = () => {
      setIsChanging(false);
    };
  };

  return (
    <div className="gallery-page-wrapper">
      <Breadcrumb title="Event Gallery" />

      <div className="gallery-page-container">
        <div className="gallery-content-wrapper">
          <EventList
            events={events}
            onSelectEvent={handleEventSelect}
            selectedEvent={selectedEvent}
          />

          <div className="gallery-display-area">
            {currentImages.length > 0 ? (
              <>
                {isChanging && (
                  <div className="gallery-loading-overlay">
                    Loading gallery...
                  </div>
                )}

                <Gallery
                  key={selectedEvent}
                  images={currentImages}
                  eventName={selectedEvent}
                />
              </>
            ) : (
              <div className="gallery-empty">
                <p>No images available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;