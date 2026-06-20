import React, { useState, useEffect } from 'react';
import EventList from '../components/EventList';
import Gallery from '../components/Gallery';
import Breadcrumb from '../components/Breadcrumb';
import './GalleryPage.css';

const GalleryPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);

  useEffect(() => {
    // Define events with direct image paths from public folder
    const eventData = [
      {
        name: "GLIMPSES OF AUTOMECHANICA DUBAI 2022",
        imageCount: 22,
        getImagePath: (i) => `/images/GLIMPSES OF AUTOMECHANICA DUBAI 2022/AUTOMECHANI-A-DUBAI-2022-img-${i}.jpeg`
      },
      {
        name: "GLIMPSES OF AUTOMEC BRAZIL 2023",
        imageCount: 8,
        getImagePath: (i) => `/images/GLIMPSES OF AUTOMEC BRAZIL 2023/AUTOMEC-BRAZIL-2023-img-${i}.jpeg`
      },
      {
        name: "GLIMPSE-OF-AUTOMECHANIKA-DUBAI-2023",
        imageCount: 30,
        getImagePath: (i) => `/images/GLIMPSE-OF-AUTOMECHANIKA-DUBAI-2023/IMG_dubai_${i}.jpeg`
      },
      {
        name: "AUTOMECHANIKA-HO-CHI-MINH CITY 2023",
        imageCount: 24,
        getImagePath: (i) => `/images/AUTOMECHANIKA-HO-CHI-MINH CITY 2023/AUTOMECHANIKA-HO-CHI-MINH-img-${i}.jpeg`
      }
    ];

    // Load image URLs (no async needed now)
    const loadEventImages = (event) => {
      const images = [];
      for (let i = 1; i <= event.imageCount; i++) {
        images.push(event.getImagePath(i));
      }
      return images;
    };

    const eventsWithImages = eventData.map(event => ({
      ...event,
      images: loadEventImages(event),
      count: event.imageCount
    }));

    setEvents(eventsWithImages);
    
    if (eventsWithImages.length > 0) {
      setSelectedEvent(eventsWithImages[0].name);
      setCurrentImages(eventsWithImages[0].images);
    }
  }, []);

  const handleEventSelect = (eventName) => {
    const event = events.find(e => e.name === eventName);
    setSelectedEvent(eventName);
    setCurrentImages(event.images);
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
          
          {currentImages.length > 0 ? (
            <Gallery 
              images={currentImages}
              eventName={selectedEvent}
            />
          ) : (
            <div style={{padding: '20px', textAlign: 'center'}}>
              <p>Loading images...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;