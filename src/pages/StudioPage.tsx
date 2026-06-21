import { useEffect, useRef, useState } from 'preact/hooks';
import { asset, Page, studioEquipment, studioInfo } from '../lib/common';

const studioImages = [
  { src: asset('/studio/studio-1.webp'), alt: 'City Biking Music studio room' },
  { src: asset('/studio/studio-2.webp'), alt: 'Studio desk and gear' },
  { src: asset('/studio/studio-3.webp'), alt: 'Wide view of the studio' },
];

export default function StudioPage() {
  const [index, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const openModal = (i: number) => {
    setIndex(i);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!modalOpen) return;
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);
  return (
    <Page title="Studio" index="01" kicker="Long Island City recording and production space">
      <div class="gallery-wrap">
        <div class="studio-gallery" ref={galleryRef}>
          {studioImages.map((img, i) => (
            <button
              class="gallery-thumb"
              onClick={() => openModal(i)}
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
      </div>
      {modalOpen && (
        <div
          class="gallery-modal"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button class="gallery-modal-close" onClick={closeModal} aria-label="Close image viewer">
            ×
          </button>
          <img
            src={studioImages[index].src}
            alt={studioImages[index].alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <p class="studio-info">{studioInfo}</p>
      <div class="equipment-grid">
        {Object.entries(studioEquipment).map(([category, items]) => (
          <div class="equipment-branch" key={category}>
            <h3>{category}</h3>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Page>
  );
}
