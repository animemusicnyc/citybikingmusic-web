import type { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';

export type Route = 'home' | 'studio' | 'team' | 'services';

export const navItems: Array<[Route, string]> = [
  ['studio', 'Studio'],
  ['team', 'Team'],
  ['services', 'Services'],
];

// Public assets live under Vite's configured base path, so prefix it instead of
// hardcoding "/..." (which 404s when the app is served from a subpath).
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

function getRoute(): Route {
  const route = window.location.hash.replace(/^#\/?/, '') as Route;
  return ['studio', 'team', 'services'].includes(route) ? route : 'home';
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute());

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return route;
}

export const studioInfo =
  'Bring your own laptop, interface, or preferred setup, or plug directly into ours. The room is built to adapt to the way you work.';

export const studioEquipment: Record<string, string[]> = {
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
  'Drums': ['Roland TD-17KX2 V-Drums', 'Professional drum libraries'],
};

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export const team: TeamMember[] = [
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

export interface Service {
  title: string;
  price: string;
  text: string;
  href: string;
}

export const services: Service[] = [
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

export function Header({ current }: { current: Route }) {
  return (
    <header class="site-nav">
      <a class="brand" href="#/" aria-label="City Biking Music home">
        [city biking music]
      </a>
      <nav aria-label="Primary navigation">
        {navItems.map(([route, label]) => (
          <a
            href={`#/${route}`}
            aria-current={current === route ? 'page' : undefined}
          >
            [{label}]
          </a>
        ))}
      </nav>
    </header>
  );
}

export function Page({
  title,
  kicker,
  index,
  children,
}: {
  title: string;
  kicker: string;
  index?: string;
  children: ComponentChildren;
}) {
  return (
    <section class="page-shell" aria-labelledby="page-heading">
      <div class="page-head">
        {index && (
          <span class="page-index" aria-hidden="true">
            {index}
          </span>
        )}
        <p class="kicker">{kicker}</p>
        <span class="page-rule" aria-hidden="true" />
      </div>
      <h2 id="page-heading">{title}</h2>
      <div class="page-content">{children}</div>
    </section>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer class="site-footer">
      <div class="footer-top">
        <a class="brand" href="#/" aria-label="City Biking Music home">
          [city biking music]
        </a>
        <nav class="footer-nav" aria-label="Footer navigation">
          {navItems.map(([route, label]) => (
            <a href={`#/${route}`}>[{label}]</a>
          ))}
        </nav>
        <div class="footer-contact">
          <a href="mailto:citybikingmusic@gmail.com">citybikingmusic@gmail.com</a>
          <a href="tel:+19292620437">(929) 262-0437</a>
        </div>
      </div>
      <p class="footer-meta">
        © {year} City Biking Music — 47-32 32nd Pl, Long Island City, NY
      </p>
    </footer>
  );
}
