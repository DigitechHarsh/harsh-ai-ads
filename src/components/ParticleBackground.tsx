import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // ── Reduced counts for performance ──
    const MAX_PARTICLES = 60;
    const CONNECTION_RADIUS = 80;
    const REPEL_RADIUS = 90;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      size: number; opacity: number;
      color: string;
    }

    // Only gold + one accent color (fewer draw calls)
    const COLORS = ['rgba(212,175,55,', 'rgba(139,92,246,', 'rgba(6,182,212,'];

    let particles: Particle[] = [];
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const makeParticle = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.15,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    const init = () => {
      particles = Array.from({ length: MAX_PARTICLES }, makeParticle);
    };

    // Throttle connection drawing — only check every other pair
    let frameCount = 0;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      frameCount++;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // ── Draw connections (batched, single path per color) ──
      // Only draw on even frames to halve the cost
      if (frameCount % 2 === 0) {
        ctx.lineWidth = 0.4;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            // Quick bounding-box reject before sqrt
            if (Math.abs(dx) > CONNECTION_RADIUS || Math.abs(dy) > CONNECTION_RADIUS) continue;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECTION_RADIUS) {
              const alpha = (1 - dist / CONNECTION_RADIUS) * 0.18;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `${particles[i].color}${alpha})`;
              ctx.stroke();
            }
          }
        }
      }

      // ── Update & draw particles ──
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repel (only if close)
        const dxm = p.x - mx;
        const dym = p.y - my;
        if (Math.abs(dxm) < REPEL_RADIUS && Math.abs(dym) < REPEL_RADIUS) {
          const distM = Math.sqrt(dxm * dxm + dym * dym);
          if (distM < REPEL_RADIUS && distM > 0) {
            const force = (REPEL_RADIUS - distM) / REPEL_RADIUS;
            p.vx += (dxm / distM) * force * 0.6;
            p.vy += (dym / distM) * force * 0.6;
          }
        }

        // Dampen velocity to prevent runaway
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x > w + 5) p.x = -5;
        else if (p.x < -5) p.x = w + 5;
        if (p.y > h + 5) p.y = -5;
        else if (p.y < -5) p.y = h + 5;

        // Draw simple dot — no shadow (shadow is very expensive)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      }

      animIdRef.current = requestAnimationFrame(animate);
    };

    // Throttle mousemove with RAF flag
    let ticking = false;
    const onMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        mouseRef.current = { x: e.clientX, y: e.clientY };
        ticking = true;
        requestAnimationFrame(() => { ticking = false; });
      }
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', () => { resize(); init(); });

    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.65 }}
    />
  );
};

export default ParticleBackground;
