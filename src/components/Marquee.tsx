// A continuously scrolling flyer band. The track holds two identical copies of
// the items so the -50% translate loops seamlessly; pausing on hover and the
// motion itself are both handled in CSS (and disabled under reduced-motion).
export function Marquee({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  return (
    <div class="marquee" aria-hidden="true">
      <div class={`marquee-track${reverse ? ' reverse' : ''}`}>
        {[0, 1].map((copy) =>
          items.map((item) => (
            <span class="marquee-item" key={`${copy}-${item}`}>
              {item}
              <span class="marquee-sep">✶</span>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
