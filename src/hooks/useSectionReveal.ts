import { useEffect } from 'preact/hooks';

// Reveal `.cb-section` elements as they scroll into view. Falls back to showing
// everything if IntersectionObserver is unavailable so content is never stuck
// hidden. Shared by the desktop one-pager and the mobile layout.
export function useSectionReveal() {
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
}
