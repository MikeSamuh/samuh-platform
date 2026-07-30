// A glitter fall for finishing a step. Canvas rather than DOM nodes so a few
// hundred pieces stay cheap, and self-contained so there's no dependency.
//
// Tuned to drift rather than drop: low gravity with enough drag to reach a slow
// terminal velocity, plus a horizontal sway, so the pieces hang in the air.
// Each piece catches the light as it tumbles — its face brightens and takes a
// white specular highlight when turned toward the viewer, which is what reads
// as "shiny" rather than just "coloured".

const COLORS = [
  "#ffd76e", // gold
  "#f7e7b4", // champagne
  "#eef4ff", // silver
  "#6fb6ff", // accent blue
  "#a79bff", // violet
  "#ff7ccf", // pink
  "#6fe39a", // mint
];

const PIECES = 180;
// Terminal velocity ends up around GRAVITY / (1 - DRAG) per frame — roughly
// 3px, so a piece takes about four seconds to cross the screen.
const GRAVITY = 0.058;
const DRAG = 0.981;
const FADE_AFTER = 3600; // ms before pieces start dissolving
const MAX_LIFE = 5400;

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
  // single central spray. The launch is deliberately fast and wide — the burst
  // has to cover the screen — while gravity and drag keep the *fall* slow. A
  // gentle launch just leaves a clump hanging over each cannon.
  const pieces = Array.from({ length: PIECES }, (_, i) => {
    const fromLeft = i % 2 === 0;
    // Fan from just-above-horizontal to near-vertical, biased upward.
    const angle = (18 + Math.random() * 62) * (Math.PI / 180);
    const speed = 15 + Math.random() * 16;
    return {
      x: fromLeft ? w() * 0.08 : w() * 0.92,
      y: h() * 0.78,
      vx: (fromLeft ? 1 : -1) * Math.cos(angle) * speed,
      vy: -Math.sin(angle) * speed,
      w: 4 + Math.random() * 5,
      h: 7 + Math.random() * 6,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.16,
      sway: 0.5 + Math.random() * 1.1,
      swaySpeed: 0.0011 + Math.random() * 0.0016,
      swayPhase: Math.random() * Math.PI * 2,
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
      p.x += p.vx + Math.sin(elapsed * p.swaySpeed + p.swayPhase) * p.sway;
      p.y += p.vy;
      p.rot += p.spin;

      // How square-on the piece is to the viewer. Foil catches the light at the
      // turn, so this drives both the squash and the flash.
      const facing = Math.abs(Math.cos(p.rot));

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * 0.6);
      ctx.globalAlpha = fade * (0.72 + facing * 0.28);
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6 + facing * 10;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * facing);

      // Specular flash at the turn — the bit that actually reads as shiny.
      const shine = Math.pow(facing, 7);
      if (shine > 0.02) {
        ctx.shadowBlur = 0;
        ctx.globalAlpha = fade * shine * 0.9;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * facing * 0.55);
      }
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
