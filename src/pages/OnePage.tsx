import CityScene from '../components/CityScene';
import {
  SectionHead,
  StudioGallery,
  SCHEDULE_URL,
  rates,
} from '../components/scroll-parts';
import { useSectionReveal } from '../hooks/useSectionReveal';
import { asset, navItems, services, studioEquipment, studioInfo, team } from '../lib/common';

export function OnePage() {
  useSectionReveal();

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
