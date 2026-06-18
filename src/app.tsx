import { Header, useRoute } from './lib/common';
import { FlyerHome } from './pages/FlyerHome';
import StudioPage from './pages/StudioPage';
import TeamPage from './pages/TeamPage';
import ServicesPage from './pages/ServicesPage';
import { useShadow } from './hooks/useShadow';

export function App() {
  const route = useRoute();
  useShadow();
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
