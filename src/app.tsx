import { Footer } from './lib/common';
import { OnePage } from './pages/OnePage';
import { useShadow } from './hooks/useShadow';

export function App() {
  useShadow();
  return (
    <>
      <main>
        <OnePage />
      </main>
      <Footer />
    </>
  );
}
