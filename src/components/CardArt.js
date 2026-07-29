"use client";

import { useEffect, useState } from "react";

// SVG cards are inlined (rather than <img>) so each card's accent colour can
// flow into the drawing via CSS custom properties. Raster cards render as-is.
export default function CardArt({ card, className }) {
  const isSvg = card.src?.endsWith(".svg");
  const [markup, setMarkup] = useState(null);

  useEffect(() => {
    if (!isSvg) return;
    let active = true;
    fetch(card.src)
      .then((r) => (r.ok ? r.text() : null))
      .then((text) => {
        if (active) setMarkup(text);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [card.src, isSvg]);

  if (!isSvg) {
    return <img className={className} src={card.src} alt="" draggable={false} />;
  }
  if (!markup) return <span className={className} />;

  return (
    <span
      className={className}
      style={{ "--accent": card.accent }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
