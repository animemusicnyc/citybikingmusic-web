import { useEffect, useState } from 'preact/hooks';
import { asset } from '../lib/common';

// Booking + rate copy shared by the desktop one-pager and the mobile layout.
export const rates = ['rehearsal space', 'studio time', 'sessions'];

// TODO: swap for the real booking calendar URL once it exists.
export const SCHEDULE_URL = '#schedule';

export const studioImages = [
  { src: asset('/studio/studio-1.webp'), alt: 'City Biking Music studio room' },
  { src: asset('/studio/studio-2.webp'), alt: 'Studio desk and gear' },
  { src: asset('/studio/studio-3.webp'), alt: 'Wide view of the studio' },
];

// Section masthead reused across the scroll: index numeral, kicker, rule, title.
export function SectionHead({
  index,
  kicker,
  title,
}: {
  index: string;
  kicker: string;
  title: string;
}) {
  return (
    <div class="cb-head">
      <div class="page-head">
        <span class="page-index" aria-hidden="true">
          {index}
        </span>
        <p class="kicker">{kicker}</p>
        <span class="page-rule" aria-hidden="true" />
      </div>
      <h2>{title}</h2>
    </div>
  );
}

export function StudioGallery() {
  const [index, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (modalOpen && e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);
  return (
    <div class="gallery-wrap">
      <div class="studio-gallery">
        {studioImages.map((img, i) => (
          <button
            class="gallery-thumb"
            onClick={() => {
              setIndex(i);
              setModalOpen(true);
            }}
            aria-label={`View larger: ${img.alt}`}
            key={img.src}
          >
            <img src={img.src} alt={img.alt} />
          </button>
        ))}
      </div>
      <div class="gallery-dots" role="tablist" aria-label="Gallery slides">
        {studioImages.map((_, i) => (
          <button
            key={i}
            class={i === index ? 'active' : ''}
            onClick={() => setIndex(i)}
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
      {modalOpen && (
        <div
          class="gallery-modal"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            class="gallery-modal-close"
            onClick={() => setModalOpen(false)}
            aria-label="Close image viewer"
          >
            ×
          </button>
          <img
            src={studioImages[index].src}
            alt={studioImages[index].alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
