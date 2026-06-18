import { Page, services } from '../lib/common';

export default function ServicesPage() {
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
