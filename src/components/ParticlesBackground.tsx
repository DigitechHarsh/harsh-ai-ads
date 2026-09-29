import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  baseOpacity: number;
  color: string;
  twinkleSpeed: number;
  twinkleAngle: number;
  isSparkle: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle setup
    const count = Math.min(Math.floor(window.innerWidth / 10), 120);
    const particles: Particle[] = [];

    const starColors = [
      "245, 185, 66",   // Rich Gold
      "56, 189, 248",   // Electric Cyan
      "192, 132, 252",  // Radiant Violet / Purple
      "255, 255, 255",  // Pure Diamond Star
      "251, 146, 60",   // Warm Sunset Amber
      "244, 114, 182",  // Cosmic Rose Pink
    ];

    for (let i = 0; i < count; i++) {
      const baseOp = Math.random() * 0.5 + 0.35;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35 - 0.1,
        opacity: baseOp,
        baseOpacity: baseOp,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleAngle: Math.random() * Math.PI * 2,
        isSparkle: Math.random() > 0.75, // 25% are special 4-point sparkle stars
      });
    }

    // Shooting stars setup
    const shootingStars: ShootingStar[] = [];
    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 90 + 70,
        speed: Math.random() * 9 + 11,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        opacity: 1,
        active: true,
      });
    };

    // Spawn shooting star every 4-7 seconds
    let lastStarTime = Date.now();
    let nextStarDelay = Math.random() * 3000 + 3500;

    // Draw 4-point star sparkle
    const drawSparkle = (x: number, y: number, radius: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${color}, ${alpha * 0.8})`;
      ctx.lineWidth = 1;
      
      // Horizontal & vertical beams
      ctx.moveTo(-radius * 2.2, 0);
      ctx.lineTo(radius * 2.2, 0);
      ctx.moveTo(0, -radius * 2.2);
      ctx.lineTo(0, radius * 2.2);
      ctx.stroke();

      // Center core
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${color}, 0.9)`;
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Constellation Connection Lines
      const maxDistance = 100;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.22 * Math.min(p1.opacity, p2.opacity);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // 2. Render floating particles & twinkling stars
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.twinkleAngle += p.twinkleSpeed;
        p.opacity = p.baseOpacity + Math.sin(p.twinkleAngle) * 0.35;

        // Wrap around screen edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const currentOpacity = Math.max(0.1, Math.min(1, p.opacity));

        if (p.isSparkle && currentOpacity > 0.5) {
          drawSparkle(p.x, p.y, p.size, p.color, currentOpacity);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${currentOpacity})`;
          ctx.shadowBlur = p.size > 1.8 ? 12 : 6;
          ctx.shadowColor = `rgba(${p.color}, 0.85)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 3. Render Shooting Stars
      const now = Date.now();
      if (now - lastStarTime > nextStarDelay) {
        spawnShootingStar();
        lastStarTime = now;
        nextStarDelay = Math.random() * 4000 + 3500;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        if (!star.active) continue;

        const endX = star.x - Math.cos(star.angle) * star.length;
        const endY = star.y - Math.sin(star.angle) * star.length;

        const grad = ctx.createLinearGradient(star.x, star.y, endX, endY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        grad.addColorStop(0.3, `rgba(245, 185, 66, ${star.opacity * 0.8})`);
        grad.addColorStop(1, "rgba(168, 85, 247, 0)");

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Star head sparkle
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = "rgba(245, 185, 66, 1)";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Move shooting star
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.015;

        if (star.opacity <= 0 || star.x > width + 100 || star.y > height + 100) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Dynamic Cosmic Nebulae / Glowing Galactic Ambient Clouds */}
      <div className="absolute -top-[15%] left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-amber-500/12 via-gold/8 to-transparent blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-[35%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-purple-600/15 via-indigo-600/10 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-[15%] left-[25%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-cyan-500/12 via-blue-600/8 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[65%] -left-[10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-r from-pink-500/8 via-purple-500/6 to-transparent blur-[130px] pointer-events-none" />
      
      {/* High-Performance Canvas for Galaxy Dust, Constellations & Shooting Stars */}
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
