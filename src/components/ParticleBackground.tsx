import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  baseX: number;
  baseY: number;
  life: number;
  maxLife: number;
  type: 'normal' | 'neon' | 'star';
}

const COLORS = [
  'rgba(212, 175, 55,',   // gold
  'rgba(139, 92, 246,',   // purple
  'rgba(6, 182, 212,',    // cyan
  'rgba(236, 72, 153,',   // pink
  'rgba(255, 255, 255,',  // white
];

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const animIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (x?: number, y?: number): Particle => {
      const colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
      const type = Math.random() < 0.1 ? 'star' : Math.random() < 0.25 ? 'neon' : 'normal';
      const px = x ?? Math.random() * canvas.width;
      const py = y ?? Math.random() * canvas.height;
      return {
        x: px, y: py, baseX: px, baseY: py,
        size: type === 'star' ? Math.random() * 3 + 1 : Math.random() * 1.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.7 + 0.1,
        color: colorBase,
        life: 0,
        maxLife: Math.random() * 300 + 200,
        type,
      };
    };

    const init = () => {
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 120);
      particlesRef.current = Array.from({ length: count }, () => createParticle());
    };

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `${color}${opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `${color}0.8)`;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, -size * 2);
        ctx.lineTo(size * 0.4, -size * 0.4);
        ctx.lineTo(size * 2, 0);
        ctx.lineTo(size * 0.4, size * 0.4);
        ctx.lineTo(0, size * 2);
        ctx.lineTo(-size * 0.4, size * 0.4);
        ctx.lineTo(-size * 2, 0);
        ctx.lineTo(-size * 0.4, -size * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.rotate(Math.PI / 4);
      }
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const repelRadius = 120;
      const attractRadius = 200;
      const connectionRadius = 100;

      const particles = particlesRef.current;

      // Draw constellation lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionRadius) {
            const alpha = (1 - dist / connectionRadius) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // Mix colors
            const c1 = particles[i].color;
            ctx.strokeStyle = `${c1}${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        if (p.life > p.maxLife) {
          particles[i] = createParticle();
          continue;
        }

        // Mouse repel/attract interaction
        const dxm = p.x - mx;
        const dym = p.y - my;
        const distM = Math.sqrt(dxm * dxm + dym * dym);

        if (distM < repelRadius) {
          // Repel
          const force = (repelRadius - distM) / repelRadius;
          p.x += (dxm / distM) * force * 5;
          p.y += (dym / distM) * force * 5;
        } else if (distM < attractRadius) {
          // Gentle attract
          const force = ((attractRadius - distM) / attractRadius) * 0.3;
          p.x -= (dxm / distM) * force;
          p.y -= (dym / distM) * force;
        }

        // Natural drift
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap edges
        if (p.x > canvas.width + 10) p.x = -10;
        else if (p.x < -10) p.x = canvas.width + 10;
        if (p.y > canvas.height + 10) p.y = -10;
        else if (p.y < -10) p.y = canvas.height + 10;

        // Life-based opacity
        const lifeFrac = p.life / p.maxLife;
        const fadeIn = Math.min(lifeFrac * 5, 1);
        const fadeOut = lifeFrac > 0.8 ? (1 - lifeFrac) / 0.2 : 1;
        const finalOpacity = p.opacity * fadeIn * fadeOut;

        if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, p.size * 0.5, p.color, finalOpacity);
        } else if (p.type === 'neon') {
          ctx.shadowBlur = 12;
          ctx.shadowColor = `${p.color}0.8)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${finalOpacity})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${finalOpacity})`;
          ctx.fill();
        }
      }

      animIdRef.current = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    // Click burst
    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const p = createParticle(e.clientX, e.clientY);
        p.speedX = Math.cos(angle) * speed;
        p.speedY = Math.sin(angle) * speed;
        p.size = Math.random() * 3 + 1;
        p.maxLife = 80;
        p.type = 'neon';
        particlesRef.current.push(p);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);
    window.addEventListener('resize', () => { resizeCanvas(); init(); });

    resizeCanvas();
    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
      cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.75 }}
    />
  );
};

export default ParticleBackground;
