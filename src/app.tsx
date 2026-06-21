import { Footer } from './lib/common';
import { OnePage } from './pages/OnePage';
import { MobilePage } from './pages/MobilePage';
import { useShadow } from './hooks/useShadow';
import { MOBILE_QUERY, useMediaQuery } from './hooks/useMediaQuery';

export function App() {
  useShadow();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  return (
    <>
      <main>{isMobile ? <MobilePage /> : <OnePage />}</main>
      <Footer />
    </>
  );
}
