import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  tag: string;
  targetView: string;
  targetParam?: { category?: string; collection?: string };
  image: string;
  accentColor: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    tag: 'BIS 925 Hallmark Certified',
    subtitle: 'Signature Heritage Line',
    title: 'Elegance That Lasts Forever.',
    description: 'Discover the beauty of 92.5 pure sterling silver jewellery handcrafted with timeless artisanal perfection.',
    buttonText: 'Explore Collection',
    targetView: 'shop',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85',
    accentColor: '#D4AF37',
  },
  {
    id: 2,
    tag: 'The Bridal Trousseau 2026',
    subtitle: 'Royal Wedding Ensembles',
    title: 'Make Every Celebration Special.',
    description: 'Discover timeless jewellery for your unforgettable moments. Polki chokers, heritage jhumkas, and intricate bridal payals.',
    buttonText: 'Shop Bridal Collection',
    targetView: 'shop',
    targetParam: { collection: 'Bridal Collection' },
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85',
    accentColor: '#E8C7CC',
  },
  {
    id: 3,
    tag: 'Contemporary Minimalism',
    subtitle: 'Modern Essentials',
    title: 'Everyday Elegance, Pure Silver.',
    description: 'Beautiful designs for every moment of your life. Featherlight solitaires, stackable bands, and anti-tarnish rhodium charms.',
    buttonText: 'Discover Everyday Designs',
    targetView: 'shop',
    targetParam: { collection: 'Everyday Designs' },
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1600&q=85',
    accentColor: '#D4AF37',
  },
  {
    id: 4,
    tag: 'Festive Auspicious Edition',
    subtitle: 'Diwali & Celebrations',
    title: 'Celebrate Every Moment With Silver.',
    description: 'Explore our exclusive festive jewellery collection. Pure silver engraved kadas, divine om medallions, and sparkling chandbalis.',
    buttonText: 'Shop Festive Collection',
    targetView: 'shop',
    targetParam: { collection: 'Festive Collection' },
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1600&q=85',
    accentColor: '#B76E79',
  },
  {
    id: 5,
    tag: 'Spring-Summer Atelier',
    subtitle: 'Just Arrived',
    title: 'Fresh Designs. Timeless Beauty.',
    description: 'Explore the latest additions to TARAKANCHAN 92.5. Italian diamond-cut chains, gemstone cocktail rings, and modern pendants.',
    buttonText: 'Explore New Arrivals',
    targetView: 'shop',
    targetParam: { collection: 'New Arrivals' },
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85',
    accentColor: '#D4AF37',
  },
  {
    id: 6,
    tag: 'Velvet Box Gift Hampers',
    subtitle: 'Expressions of Love',
    title: 'Make Your Loved Ones Feel Special.',
    description: 'Discover meaningful gifts crafted with elegance. Matching silver sets in royal velvet presentation boxes with personalized gift notes.',
    buttonText: 'Explore Gifts',
    targetView: 'shop',
    targetParam: { category: 'Gift Sets' },
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1600&q=85',
    accentColor: '#E8C7CC',
  },
];

interface HeroCarouselProps {
  onNavigate: (view: string, params?: any) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // 5-second automatic progression
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div
      role="region"
      aria-label="Hero Luxury Jewellery Carousel"
      className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] overflow-hidden bg-[#3E2630]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images with Crossfade */}
      {HERO_SLIDES.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-center filter brightness-[0.68] contrast-[1.08]"
          />
          {/* Luxury Burgundy & Gold overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#3E2630]/95 via-[#6F4C57]/70 to-transparent lg:w-3/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3E2630] via-transparent to-black/40" />
        </div>
      ))}

      {/* Slide Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-12 flex flex-col justify-center">
        <div className="max-w-2xl text-[#F8F1F1] space-y-4 sm:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#6F4C57]/80 border border-[#D4AF37]/50 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              {slide.tag}
            </span>
          </div>

          <p className="text-sm sm:text-base tracking-[0.2em] uppercase text-[#E8C7CC] font-light">
            {slide.subtitle}
          </p>

          <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-wide text-[#F8F1F1] drop-shadow-md">
            {slide.title}
          </h1>

          <p className="text-sm sm:text-lg text-zinc-200/90 font-light leading-relaxed max-w-xl">
            {slide.description}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate(slide.targetView, slide.targetParam)}
              className="px-7 py-3.5 rounded-full bg-[#B76E79] hover:bg-[#C8A4A6] text-white font-medium text-sm sm:text-base tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center space-x-3 cursor-pointer group border border-[#D4AF37]/30"
            >
              <span>{slide.buttonText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('shop', { collection: 'All' })}
              className="px-6 py-3.5 rounded-full bg-[#3E2630]/60 hover:bg-[#6F4C57]/80 text-[#F8F1F1] font-medium text-sm sm:text-base tracking-wider border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all backdrop-blur-sm cursor-pointer"
            >
              View All Catalogue
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-[#3E2630]/60 hover:bg-[#6F4C57] text-white border border-[#D4AF37]/40 hover:border-[#D4AF37] transition backdrop-blur-sm cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-[#3E2630]/60 hover:bg-[#6F4C57] text-white border border-[#D4AF37]/40 hover:border-[#D4AF37] transition backdrop-blur-sm cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Bottom Progress Bar & Pagination Indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-30 max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Pagination Dots */}
        <div className="flex items-center space-x-2.5">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 transition-all rounded-full cursor-pointer ${
                idx === currentSlide
                  ? 'w-8 bg-[#D4AF37]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Slide Counter & Pause Status */}
        <div className="flex items-center space-x-3 text-xs text-zinc-300 font-mono">
          <span>0{currentSlide + 1} / 0{HERO_SLIDES.length}</span>
          {isPaused && (
            <span className="text-[10px] text-[#D4AF37] tracking-wider uppercase bg-[#3E2630]/80 px-2 py-0.5 rounded border border-[#D4AF37]/30">
              Paused
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
