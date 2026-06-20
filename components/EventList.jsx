import React from 'react';
import './EventList.css';

const EventList = ({ events, onSelectEvent, selectedEvent }) => {
  return (
    <div className="event-list">
      <h3>Events Gallery</h3>
      <div className="event-buttons">
        {events.map((event, index) => (
          <button
            key={index}
            className={`event-btn ${selectedEvent === event.name ? 'active' : ''}`}
            onClick={() => onSelectEvent(event.name)}
          >
            {event.name}
            <span className="image-count">({event.count} images)</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventList;