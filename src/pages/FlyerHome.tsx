import CityScene from '../components/CityScene';
import { Marquee } from '../components/Marquee';
import { Header, Route } from '../lib/common';

const marqueeItems = [
  'rehearsal space',
  'studio time',
  'sessions',
  'mixing',
  'mastering',
  'long island city',
];

export function FlyerHome({ current }: { current: Route }) {
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
        <figure class="map-card">
          <CityScene />
        </figure>
      </div>
      <address class="address">
        <span class="address-primary">
          <span>47-32 32nd Pl,</span>
          <span>Long Island City, New York</span>
        </span>
        <span>Suite 5007</span>
      </address>

      <Marquee items={marqueeItems} />

      <section class="contact-strip" aria-label="Contact and booking">
        <div class="contact-col">
          <h2 id="book-heading">Book Time</h2>
          <a class="reserve-btn" href="https://citybikingmusic.com/book.html">Reserve Online</a>

          <h4 class="book-note">Hourly or Monthly, with guaranteed availability</h4>
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
