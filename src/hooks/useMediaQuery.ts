import { useEffect, useState } from 'preact/hooks';

// Track a media query reactively. Used to swap the desktop one-pager for the
// dedicated mobile layout at the breakpoint.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const MOBILE_QUERY = '(max-width: 760px)';
