import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

type Route = 'home' | 'studio' | 'team' | 'services';

// Public assets live under Vite's configured base path, so prefix it instead of
// hardcoding "/..." (which 404s when the app is served from a subpath).
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const navItems: Array<[Route, string]> = [
  ['studio', 'Studio'],
  ['team', 'Team'],
  ['services', 'Services'],
];

const studioInfo = 'Bring your own laptop, interface, or preferred setup, or plug directly into ours. The room is built to adapt to the way you work.';

const studioEquipment: Record<string, string[]> = {
  'DAW & Interface': [
    'Logic Pro 11',
    'Ableton Live 12.3',
    'Scarlett 18i20 interface',
  ],
  'Microphones & Preamps': [
    'AKG C414',
    'Rupert Neve 511 preamp',
    'dbx 560A compressor',
  ],
  'Guitars & Amps': [
    'Vox AC30C2',
    'Supro Galaxy 1697R',
    'Mesa Boogie Mini Rectifier',
  ],
  'Synths, Keys & MIDI': [
    'Sequential Prophet REV-2',
    'Behringer Poly D',
    'Ableton Push 2',
  ],
  'Drums': [
    'Roland TD-17KX2 V-Drums',
    'Professional drum libraries',
  ],
};

const team = [
  {
    name: 'Patrick John Paul Curran',
    role: 'Studio Manager / Engineer / Producer',
    image: '/team/patrick-curran.webp',
    bio: 'Lifelong keyboardist and producer focused on pop, rock, and electronic music. Patrick specializes in tracking sessions, synth programming, sound design, and full-project mixing and mastering.',
  },
  {
    name: 'Noah Grande',
    role: 'Engineer / Producer / Beatmaker',
    image: '/team/noah-grande.webp',
    bio: 'Producer and engineer with over 15 years of experience across electronic, hip-hop, indie rock, and pop. Noah brings a flexible, genre-agnostic approach to recording, beatmaking, and mixing.',
  },
  {
    name: 'ChezRocka',
    role: 'Engineer',
    image: '/team/chezrocka.webp',
    bio: 'Veteran NYC engineer with over 25 years of experience, rooted in the boom bap hip-hop scene. Known for precision tracking, punchy mixes, and a deep understanding of classic and modern workflows.',
  },
  {
    name: 'Daniel "Bobo" Stuart',
    role: 'Producer / Drum Tracking Specialist',
    image: '/team/daniel-stuart.webp',
    bio: 'Lifelong drummer specializing in rock-based styles including pop-punk, emo, and hardcore. Bobo focuses on expressive, tight drum performances and production-ready drum tracking.',
  },
  {
    name: 'Kevin Poli',
    role: 'Visual Artist',
    image: '/team/kevin-poli.webp',
    bio: '2D and 3D visual artist specializing in promotional design, album artwork, and visual assets that support artists\' creative identity.',
  },
];

const services = [
  {
    title: 'Mixing & Mastering',
    price: '$300',
    text: 'A complete mix and master by an engineer from the team.',
    href: 'https://square.link/u/lN8WyFw8?src=embed',
  },
  {
    title: 'Mastering Only',
    price: '$75',
    text: 'A professional master for a finished mix.',
    href: 'https://square.link/u/jt4gNcAw?src=embed',
  },
];

function getRoute(): Route {
  const route = window.location.hash.replace(/^#\/?/, '') as Route;
  return ['studio', 'team', 'services'].includes(route) ? route : 'home';
}

function useRoute() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute());

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return route;
}

function Header({ current }: { current: Route }) {
  return (
    <header class="site-nav">
      <a class="brand" href="#/" aria-label="City Biking Music home">
        [city biking music]
      </a>
      <nav aria-label="Primary navigation">
        {navItems.map(([route, label]) => (
          <a href={`#/${route}`} aria-current={current === route ? 'page' : undefined}>
            [{label}]
          </a>
        ))}
      </nav>
    </header>
  );
}

function FlyerHome({ current }: { current: Route }) {
  const mapRef = useRef<HTMLElement>(null);
  useMouseTilt(mapRef);

  return (
    <section class="flyer-hero" aria-labelledby="page-title">
      <Header current={current} />

      <h1 id="page-title">"CITY BIKING MUSIC"</h1>

      <div class="details" aria-label="Services and location">
        <div class="rates">
          <p class="rates-label">affordable rates in:</p>
          <ul>
            <li>rehearsal space</li>
            <li>studio time</li>
            <li>sessions</li>
          </ul>
        </div>

        <figure class="map-card" ref={mapRef}>
          <a
            href="https://www.google.com/maps/search/?api=1&query=47-32%2032nd%20Pl%20Suite%205007%2C%20Long%20Island%20City%2C%20NY%2011101"
            target="_blank"
            rel="noreferrer"
            aria-label="Open City Biking Music address in Google Maps"
          >
            <img src={asset('/map.webp')} alt="Map showing City Biking Music in Long Island City" />
          </a>
        </figure>
      </div>

      <address class="address">
        <span class="address-primary">
          <span>47-32 32nd Pl,</span>
          <span>Long Island City, New York</span>
        </span>
        <span>Suite 5007</span>
      </address>

      <section class="contact-strip" aria-label="Contact and booking">
        <div class="contact-col">
          <h2 id="book-heading">Book Time</h2>
          <a class="reserve-btn" href="https://citybikingmusic.com/book.html">Reserve Online</a>
        </div>
        <div class="contact-divider" />
        <div class="contact-col">
          <a href="mailto:citybikingmusic@gmail.com">citybikingmusic@gmail.com</a>
          <a href="https://citybikingmusic.com">citybikingmusic.com</a>
          <a href="tel:+19292620437">(929) 262-0437</a>
        </div>
      </section>
    </section>
  );
}

function StudioPage() {
  return (
    <Page title="Studio" kicker="Long Island City recording and production space">
      <div class="studio-layout">
        <div class="studio-images">
          <img src={asset('/studio/studio-1.webp')} alt="City Biking Music studio room" />
          <img src={asset('/studio/studio-2.webp')} alt="Studio desk and gear" />
          <img src={asset('/studio/studio-3.webp')} alt="Wide view of the studio" />
        </div>

        <div class="studio-right">
          <p class="studio-info">{studioInfo}</p>
          <div class="equipment-tree">
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
        </div>
      </div>
    </Page>
  );
}
function TeamPage() {
  return (
    <Page title="Team" kicker="Engineers, producers, and visual support">
      <div class="team-grid">
        {team.map((member) => (
          <article class="team-card" key={member.name}>
            <img src={asset(member.image)} alt={member.name} />
            <div>
              <h3>{member.name}</h3>
              <p class="role">{member.role}</p>
              <p>{member.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </Page>
  );
}

function ServicesPage() {
  return (
    <Page title="Services" kicker="Mixing and mastering">
      <div class="simple-grid two">
        {services.map((service) => (
          <article class="simple-card service-card">
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
    </Page>
  );
}

function Page({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker: string;
  children: ComponentChildren;
}) {
  return (
    <section class="page-shell" aria-labelledby="page-heading">
      <p class="kicker">{kicker}</p>
      <h2 id="page-heading">{title}</h2>
      <div class="page-content">{children}</div>
    </section>
  );
}

function useMouseShadow() {
  useEffect(() => {
    const root = document.documentElement;
    const maxOffset = 7; // px the shadow can throw — kept tight so it stays attached
    // feOffset + feTurbulence nodes for the SVG (glyph-contoured) shadows.
    const svgOffsets = ['gs-w-off', 'gs-r-off']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);
    const svgTurb = ['gs-w-turb', 'gs-r-turb']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);

    let frame = 0;
    let ox = 0;
    let oy = 0;
    let seed = 1;

    const apply = () => {
      frame = 0;
      for (const node of svgOffsets) {
        node.setAttribute('dx', ox.toFixed(1));
        node.setAttribute('dy', oy.toFixed(1));
      }
      // Re-seed the turbulence so the grain pattern refreshes while moving.
      for (const node of svgTurb) node.setAttribute('seed', String(seed));
    };

    const onMove = (e: PointerEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      // -1..1 from screen center; shadow falls opposite the cursor (light = cursor)
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      const dist = Math.min(1, Math.hypot(dx, dy));

      ox = -dx * maxOffset;
      oy = -dy * maxOffset;
      seed = (seed % 90) + 1; // cycle a small range so each move regenerates noise

      // Pseudo-element panels read these directly; --gx/--gy scroll their grain.
      root.style.setProperty('--sx', `${ox.toFixed(1)}px`);
      root.style.setProperty('--sy', `${oy.toFixed(1)}px`);
      root.style.setProperty('--si', dist.toFixed(3));
      root.style.setProperty('--gx', `${(e.clientX * 0.7).toFixed(0)}px`);
      root.style.setProperty('--gy', `${(e.clientY * 0.7).toFixed(0)}px`);

      // SVG filters re-render on attribute change — batch to one per frame.
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}

function useMouseTilt(ref: { current: HTMLElement | null }) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const maxDeg = 6;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      el.style.setProperty('--rx', `${(-dy * maxDeg).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(dx * maxDeg).toFixed(2)}deg`);
    };

    const onLeave = () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };

    window.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [ref]);
}

export function App() {
  const route = useRoute();
  useMouseShadow();

  return (
    <>
      <main>
        {route === 'home' && <FlyerHome current={route} />}
        {route !== 'home' && <Header current={route} />}
        {route === 'studio' && <StudioPage />}
        {route === 'team' && <TeamPage />}
        {route === 'services' && <ServicesPage />}
      </main>
    </>
  );
}
