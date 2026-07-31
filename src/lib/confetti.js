// A small confetti burst for finishing a step — the Trello "card hit Done"
// moment. Canvas rather than DOM nodes so a couple of hundred pieces stay
// cheap, and self-contained so there's no dependency to add.

const COLORS = ["#4a9eff", "#7f77dd", "#3ba55d", "#e88a2a", "#d6409a", "#e8e9eb"];

const PIECES = 140;
const GRAVITY = 0.32;
const DRAG = 0.992;
const FADE_AFTER = 1400; // ms before pieces start dissolving
const MAX_LIFE = 2600;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export function burstConfetti() {
  if (typeof document === "undefined") return;
  // Celebration is decoration; never force it on someone who's asked for less.
  if (prefersReducedMotion()) return;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "9999",
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function size() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  window.addEventListener("resize", size);

  const w = () => window.innerWidth;
  const h = () => window.innerHeight;

  // Two side cannons firing inward and up, which reads more celebratory than a
  // single central spray.
  const pieces = Array.from({ length: PIECES }, (_, i) => {
    const fromLeft = i % 2 === 0;
    const spread = (Math.random() - 0.5) * 1.1;
    const power = 11 + Math.random() * 9;
    return {
      x: fromLeft ? w() * 0.12 : w() * 0.88,
      y: h() * 0.72,
      vx: (fromLeft ? 1 : -1) * (power * (0.55 + Math.random() * 0.5)),
      vy: -power * (0.85 + Math.random() * 0.6) + spread,
      w: 6 + Math.random() * 6,
      h: 9 + Math.random() * 7,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.32,
      color: COLORS[i % COLORS.length],
    };
  });

  const start = performance.now();
  let frame;
  let done = false;
  // requestAnimationFrame stops in a backgrounded tab, so the end-of-animation
  // cleanup may never run and the overlay would outlive the burst. Timers keep
  // firing, so this is the backstop that actually guarantees removal.
  let safety;

  function tick(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, w(), h());

    const fade =
      elapsed < FADE_AFTER
        ? 1
        : Math.max(0, 1 - (elapsed - FADE_AFTER) / (MAX_LIFE - FADE_AFTER));

    for (const p of pieces) {
      p.vy += GRAVITY;
      p.vx *= DRAG;
      p.vy *= DRAG;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.spin;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = fade;
      ctx.fillStyle = p.color;
      // Flip the height by the spin phase so pieces read as tumbling foil.
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot)));
      ctx.restore();
    }

    if (elapsed < MAX_LIFE) {
      frame = requestAnimationFrame(tick);
    } else {
      cleanup();
    }
  }

  function cleanup() {
    if (done) return;
    done = true;
    cancelAnimationFrame(frame);
    clearTimeout(safety);
    window.removeEventListener("resize", size);
    canvas.remove();
  }

  safety = setTimeout(cleanup, MAX_LIFE + 600);
  frame = requestAnimationFrame(tick);
  return cleanup;
}
