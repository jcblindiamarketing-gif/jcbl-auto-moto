import React, { useEffect } from 'react';
import './Lightbox.css';

const Lightbox = ({ images, currentIndex, onClose }) => {
  const [index, setIndex] = React.useState(currentIndex);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index]);

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <button className="nav-btn prev" onClick={prevImage}>‹</button>
        <img src={images[index]} alt={`Gallery ${index + 1}`} />
        <button className="nav-btn next" onClick={nextImage}>›</button>
        <div className="image-counter">
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default Lightbox;