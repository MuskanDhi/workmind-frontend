import { useEffect } from 'react';

// Pure-JS confetti — no external package needed.
// Just drop <Confetti /> anywhere and it fires once on mount.

const random = (min, max) => Math.random() * (max - min) + min;

const COLORS = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];

const Confetti = ({ duration = 3000 }) => {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none; z-index: 9999;
    `;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const pieces = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      pieces.push({
        x: random(0, canvas.width),
        y: random(-200, 0),
        w: random(8, 16),
        h: random(6, 12),
        color: COLORS[Math.floor(random(0, COLORS.length))],
        angle: random(0, Math.PI * 2),
        spin: random(-0.15, 0.15),
        vx: random(-3, 3),
        vy: random(3, 8),
        opacity: 1,
      });
    }

    let startTime = null;
    let animId;

    const draw = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        p.vy += 0.15; // gravity
        p.opacity = Math.max(0, 1 - elapsed / duration);

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (elapsed < duration + 500) {
        animId = requestAnimationFrame(draw);
      } else {
        canvas.remove();
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      canvas.remove();
    };
  }, [duration]);

  return null; // Renders nothing to DOM directly
};

export default Confetti;
