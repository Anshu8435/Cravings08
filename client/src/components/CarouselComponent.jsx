import React, { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

// Curated Enterprise-grade culinary imagery via optimized CDN (WebP, auto-format, compressed)
const slides = [
  {
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1600&auto=format&fit=crop',
    alt: 'Gourmet Artisanal Burger',
  },
  {
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop',
    alt: 'Wood-Fired Neapolitan Pizza',
  },
  {
    url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1600&auto=format&fit=crop',
    alt: 'Fresh Salmon Poke & Sushi',
  },
  {
    url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=1600&auto=format&fit=crop',
    alt: 'Steamed Gourmet Dumplings',
  },
];

const CarouselComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-rotate carousel with smooth Ken Burns breathing effect
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Carousel Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          <img
            src={slide.url}
            alt={slide.alt}
            loading={index === 0 ? 'eager' : 'lazy'}
            className="w-full h-full object-cover transition-transform duration-7000 ease-linear transform scale-105"
          />
          {/* Cinematic Vignette Overlay for Crisp Typography Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/50" />
        </div>
      ))}

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-200 z-10 backdrop-blur-md hover:scale-110 shadow-lg"
        aria-label="Previous slide"
      >
        <IoChevronBack size={22} />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 sm:left-auto sm:right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-200 z-10 backdrop-blur-md hover:scale-110 shadow-lg"
        aria-label="Next slide"
      >
        <IoChevronForward size={22} />
      </button>

      {/* Modern Capsule Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-(--color-primary) w-7'
                : 'bg-white/40 hover:bg-white/70 w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselComponent;
