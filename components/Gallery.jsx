'use client';

import { useState } from 'react';
import Lightbox from './Lightbox';
import './Gallery.css';

export default function Gallery({
  events,
  selectedEvent,
  setSelectedEvent,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="gallery-container">

      <div className="gallery-tabs">
        {events.map((event) => (
          <button
            key={event.name}
            onClick={() => setSelectedEvent(event)}
            className={
              selectedEvent.name === event.name
                ? 'tab-btn active'
                : 'tab-btn'
            }
          >
            {event.name}
          </button>
        ))}
      </div>

      <h2 className="event-title">
        {selectedEvent.name}
      </h2>

      <div className="gallery-grid">
        {selectedEvent.images.map((image, index) => (
          <div
            key={index}
            className="gallery-item"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image}
              alt={`${selectedEvent.name} ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={selectedEvent.images}
          currentIndex={currentImageIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}