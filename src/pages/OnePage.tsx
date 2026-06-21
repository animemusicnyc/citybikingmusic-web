import { useEffect, useState } from 'preact/hooks';
import CityScene from '../components/CityScene';
import {
  asset,
  navItems,
  services,
  studioEquipment,
  studioInfo,
  team,
} from '../lib/common';

const rates = ['rehearsal space', 'studio time', 'sessions'];

// TODO: swap for the real booking calendar URL once it exists.
const SCHEDULE_URL = '#schedule';

const studioImages = [
  { src: asset('/studio/studio-1.webp'), alt: 'City Biking Music studio room' },
  { src: asset('/studio/studio-2.webp'), alt: 'Studio desk and gear' },
  { src: asset('/studio/studio-3.webp'), alt: 'Wide view of the studio' },
];

// Section masthead reused across the scroll: index numeral, kicker, rule, title.
function SectionHead({
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

function StudioGallery() {
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

export function OnePage() {
  // Reveal sections as they scroll into view. Falls back to showing everything
  // if IntersectionObserver is unavailable so content is never stuck hidden.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('.cb-section'));
    if (!('IntersectionObserver' in window)) {
      sections.forEach((s) => s.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div class="cb">
      {/* Persistent top bar — red rule + brand + anchor nav, over everything. */}
      <header class="cb-nav">
        <a class="brand" href="#top" aria-label="City Biking Music home">
          [city biking music]
        </a>
        <nav aria-label="Primary navigation">
          {navItems.map(([route, label]) => (
            <a href={`#${route}`}>[{label}]</a>
          ))}
          <a href="#top">[Book]</a>
        </nav>
      </header>

      {/* HERO — the 3D city, liberated to full viewport. */}
      <section class="cb-hero" id="top" aria-label="City Biking Music">
        <div class="cb-hero-city">
          <CityScene fit={1.85} />
        </div>
        <div class="cb-hero-veil" aria-hidden="true" />

        {/* Title centred; everything else staggered to the edges. */}
        <p class="cb-hero-kicker">Queens, New York</p>

        <div class="cb-hero-title">
          <h1>"CITY BIKING MUSIC"</h1>
        </div>

        <div class="cb-hero-foot">
          <div class="cb-hero-book">
            <p class="cb-hero-sub">
              Recording · Rehearsal
              <br />
              Mixing &amp; Mastering
            </p>
            <ul class="cb-hero-rates">
              <li>
                <strong>$30</strong>/hr <span>rehearsal &amp; studio time</span>
              </li>
              <li>
                <strong>$200</strong>/mo <span>unlimited access</span>
              </li>
            </ul>
            <a class="reserve-btn" href={SCHEDULE_URL}>
              Schedule
            </a>
            <span class="cb-hero-note">
              Hourly or monthly · guaranteed availability
            </span>
          </div>
          <address class="cb-hero-contact">
            <a href="tel:+19292620437">(929) 262-0437</a>
            <a href="mailto:citybikingmusic@gmail.com">
              citybikingmusic@gmail.com
            </a>
            <span class="cb-hero-addr">
              47-32 32nd Pl
              <br />
              Long Island City, NY · Suite 5007
            </span>
          </address>
        </div>

        <a class="cb-scroll" href="#rates" aria-label="Scroll to rates">
          <span>scroll</span>
          <span class="cb-scroll-arrow" aria-hidden="true">
            ↓
          </span>
        </a>
      </section>

      {/* RATES */}
      <section class="cb-section cb-rates-section" id="rates">
        <p class="rates-label">affordable rates in:</p>
        <ul class="cb-rates-list">
          {rates.map((rate) => (
            <li key={rate}>{rate}</li>
          ))}
        </ul>
      </section>

      {/* STUDIO */}
      <section class="cb-section" id="studio">
        <SectionHead
          index="01"
          kicker="Long Island City recording and production space"
          title="Studio"
        />
        <StudioGallery />
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
      </section>

      {/* TEAM */}
      <section class="cb-section" id="team">
        <SectionHead
          index="02"
          kicker="Engineers, producers, and visual support"
          title="Team"
        />
        <div class="team-list">
          {team.map((member) => (
            <article class="team-item" key={member.name}>
              <img src={asset(member.image)} alt={member.name} />
              <div>
                <h2>{member.name}</h2>
                <p class="role">{member.role}</p>
                <p>{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section class="cb-section" id="services">
        <SectionHead index="03" kicker="Mixing and mastering" title="Services" />
        <div class="simple-grid two">
          {services.map((service) => (
            <article class="simple-card service-card" key={service.title}>
              <div>
                <h3>{service.title}</h3>
                <strong>{service.price}</strong>
              </div>
              <p>{service.text}</p>
              <a href={service.href} target="_blank" rel="noreferrer">
                Select Service
              </a>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
