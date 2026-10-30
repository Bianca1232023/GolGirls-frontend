import { useEffect, useRef, useState, type TouchEvent } from 'react';
import './styless.scss';
import educationIcon from '../../assets/fluent-emoji-flat_open-book.svg';
import footballIcon from '../../assets/noto_soccer-ball.svg';

export type VideoCategory = 'educacao' | 'futebol';

export interface CarouselItem {
  id: number | string;
  titulo: string;
  data: string;
  categoria: VideoCategory;
}

interface CarouselProps {
  items: CarouselItem[];
}

function ArrowLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2" />

      <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const updateVisibleCards = () => {
      setVisibleCards(window.matchMedia('(max-width: 600px)').matches ? 1 :
        window.matchMedia('(max-width: 900px)').matches ? 2 : 3);
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  const cardsInView = Math.min(visibleCards, items.length);
  const maxIndex = Math.max(items.length - cardsInView, 0);

  const next = () => {
    setCurrentIndex((current) => Math.min(current + 1, maxIndex));
  };

  const previous = () => {
    setCurrentIndex((current) => Math.max(current - 1, 0));
  };

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    const end = event.changedTouches[0];
    if (!start || !end) return;

    const deltaX = end.clientX - start.x;
    const deltaY = end.clientY - start.y;
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    if (deltaX < 0) next();
    else previous();
  }

  if (!items.length) {
    return null;
  }

  return (
    <section className="carousel">
      <button
        type="button"
        className="carousel__arrow carousel__arrow--left"
        onClick={previous}
        disabled={currentIndex === 0}
        aria-label="Evento anterior"
      >
        <ArrowLeft />
      </button>

      <div
        className="carousel__window"
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
        }}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStart.current = null;
        }}
      >
        <div
          className="carousel__track"
          style={{
            width: `${(items.length / cardsInView) * 100}%`,
            transform: `translateX(-${(currentIndex * cardsInView * 100) / items.length}%)`,
          }}
        >
          {items.map((item) => (
            <article
              className="carousel__card"
              key={item.id}
              style={{ flexBasis: `${100 / items.length}%` }}
            >
              <div className={`carousel__category carousel__category--${item.categoria}`}>
                <img
                  src={item.categoria === 'educacao' ? educationIcon : footballIcon}
                  alt=""
                  className="carousel__category-icon"
                />
                <span>{item.categoria === 'educacao' ? 'Educação' : 'Futebol'}</span>
              </div>

              <div className="carousel__content">
                <h3 className="carousel__title">{item.titulo}</h3>

                <div className="carousel__info">
                  <CalendarIcon />

                  <span>{item.data}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="carousel__arrow carousel__arrow--right"
        onClick={next}
        disabled={currentIndex >= maxIndex}
        aria-label="Próximo evento"
      >
        <ArrowRight />
      </button>

      {/* BOLINHAS */}

      <div className="carousel__dots">
        {Array.from({ length: maxIndex + 1 }, (_, index) => {
          const isActive = index === currentIndex;

          return (
            <button
              type="button"
              key={index}
              className={`carousel__dot ${isActive ? 'carousel__dot--active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir para o item ${index + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
}
