import CityScene from '../components/CityScene';
import {
  SectionHead,
  StudioGallery,
  SCHEDULE_URL,
} from '../components/scroll-parts';
import { useSectionReveal } from '../hooks/useSectionReveal';
import { asset, navItems, services, studioEquipment, studioInfo, team } from '../lib/common';

// Dedicated mobile layout: a shorter city hero up top, then booking + contact
// in the very first scroll, then the editorial sections as a natural stack.
// Reuses the shared component classes (gallery, equipment, team, cards) and the
// `.cb-section` reveal; everything bespoke to mobile is prefixed `.mb-`.
export function MobilePage() {
  useSectionReveal();

  return (
    <div class="mb">
      <header class="mb-nav">
        <a class="brand" href="#top" aria-label="City Biking Music home">
          [cbm]
        </a>
        <nav aria-label="Primary navigation">
          {navItems.map(([route, label]) => (
            <a href={`#${route}`}>{label}</a>
          ))}
        </nav>
      </header>

      {/* HERO — the 3D city, sized so the booking block sits just below the fold. */}
      <section class="mb-hero" id="top" aria-label="City Biking Music">
        <div class="mb-hero-city">
          <CityScene fit={1.6} dpr={1.5} />
        </div>
        <div class="mb-hero-veil" aria-hidden="true" />
        <div class="mb-hero-title">
          <p class="mb-hero-kicker">Queens, New York</p>
          <h1>"CITY BIKING MUSIC"</h1>
          <p class="mb-hero-sub">Recording · Rehearsal · Mixing &amp; Mastering</p>
        </div>
      </section>

      {/* BOOK — pricing, schedule, and contact front and centre. */}
      <section class="cb-section mb-book" id="book">
        <ul class="mb-rates">
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
        <p class="mb-note">Hourly or monthly · guaranteed availability</p>
        <address class="mb-contact">
          <a href="tel:+19292620437">(929) 262-0437</a>
          <a href="mailto:citybikingmusic@gmail.com">citybikingmusic@gmail.com</a>
          <span class="mb-addr">
            47-32 32nd Pl, Long Island City, NY · Suite 5007
          </span>
        </address>
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
