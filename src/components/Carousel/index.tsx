import { useState } from 'react';
import './styless.scss';

export interface CarouselItem {
  id: number | string;
  imagem: string;
  titulo: string;
  data: string;
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

function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 10C20 15.5 12 22 12 22C12 22 4 15.5 4 10C4 5.58 7.58 2 12 2C16.42 2 20 5.58 20 10Z"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleCards = 3;

  const maxIndex = Math.max(items.length - visibleCards, 0);

  const next = () => {
    setCurrentIndex((current) => Math.min(current + 1, maxIndex));
  };

  const previous = () => {
    setCurrentIndex((current) => Math.max(current - 1, 0));
  };

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

      <div className="carousel__window">
        <div
          className="carousel__track"
          style={{
            transform: `translateX(-${currentIndex * 33.333}%)`,
          }}
        >
          {items.map((item) => (
            <article className="carousel__card" key={item.id}>
              <div className="carousel__image-wrapper">
                <img src={item.imagem} alt={item.titulo} className="carousel__image" />
              </div>

              {/* CONTEÚDO */}

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
        {items.map((item, index) => {
          const isActive = index === currentIndex;

          return (
            <button
              type="button"
              key={item.id}
              className={`carousel__dot ${isActive ? 'carousel__dot--active' : ''}`}
              onClick={() => setCurrentIndex(Math.min(index, maxIndex))}
              aria-label={`Ir para ${item.titulo}`}
            />
          );
        })}
      </div>
    </section>
  );
}
