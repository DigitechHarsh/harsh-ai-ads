import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";

const Cinematic3DSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Scroll-driven values
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-40, 0, 40]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -10]);
  const scale   = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.7, 1, 1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const translateX = useTransform(scrollYProgress, [0, 0.5, 1], [-120, 0, 120]);

  const springRotateY = useSpring(rotateY, { stiffness: 80, damping: 20 });
  const springRotateX = useSpring(rotateX, { stiffness: 80, damping: 20 });
  const springScale   = useSpring(scale,   { stiffness: 60, damping: 18 });

  // Text parallax
  const textY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  // Mouse tilt on the card
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set(((e.clientX - cx) / (rect.width / 2)) * 12);
    mouseY.set(-((e.clientY - cy) / (rect.height / 2)) * 8);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const springMouseX = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const springMouseY = useSpring(mouseY, { stiffness: 200, damping: 25 });

  const adTypes = ["CGI", "UGC", "Cinematic"];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[120vh] flex items-center justify-center overflow-hidden bg-background py-32"
    >
      {/* Deep background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(43 80% 55%) 1px, transparent 0)", backgroundSize: "40px 40px" }}
      />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Text ── */}
          <motion.div style={{ y: textY }} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              <Sparkles className="w-3 h-3" />
              The Transformation Engine
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-black leading-[1.0] tracking-tight"
            >
              Scroll to{" "}
              <span className="text-gold-gradient block">See the Magic</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-muted-foreground text-xl leading-relaxed"
            >
              One product photo. Three AI formats. Infinite possibilities. Watch your brand transform in real-time as you scroll.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              {adTypes.map((type) => (
                <div
                  key={type}
                  className="px-5 py-2.5 rounded-xl bg-secondary/30 border border-gold/20 text-gold font-bold text-sm"
                >
                  {type} Ads
                </div>
              ))}
            </motion.div>

            <motion.a
              href="#form"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-gold-gradient text-black font-bold px-8 py-4 rounded-2xl text-lg hover:scale-105 transition-transform"
            >
              Start Your Transformation <ChevronRight className="w-5 h-5" />
            </motion.a>
          </motion.div>

          {/* ── Right: 3D Spinning Card ── */}
          <div
            className="perspective-container flex items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={cardRef}
          >
            <motion.div
              style={{
                rotateY: springRotateY,
                rotateX: springRotateX,
                scale: springScale,
                opacity,
                translateX,
              }}
              className="relative w-full max-w-md aspect-[3/4]"
            >
              {/* Shadow layer — adds 3D depth illusion */}
              <div className="absolute inset-8 bg-gold/20 blur-3xl rounded-3xl" />

              {/* Main card */}
              <motion.div
                className="card-3d relative w-full h-full rounded-[2rem] overflow-hidden border border-gold/30 glow-gold-md bg-background"
                style={{ rotateX: springMouseY, rotateY: springMouseX }}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/5" />

                {/* Cinematic scanlines overlay */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)" }}
                />

                {/* 4K Badge */}
                <div className="absolute top-5 right-5 z-20">
                  <div className="bg-gold text-black text-[9px] font-black px-3 py-1 rounded-full shadow-lg tracking-widest">
                    4K ULTRA HD
                  </div>
                </div>

                {/* Inner content area */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-6 p-8">
                  {/* Logo */}
                  <div className="w-20 h-20 rounded-2xl bg-gold/20 border border-gold/30 flex items-center justify-center glow-gold-sm">
                    <img src="/logo.png" alt="Harsh AI" className="w-12 h-12 object-contain" />
                  </div>

                  {/* Rotating format display */}
                  <div className="text-center space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Currently Creating</p>
                    <motion.div
                      key="format"
                      className="text-3xl font-display font-black text-gold-gradient"
                      animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 0, times: [0, 0.15, 0.85, 1] }}
                    >
                      {["CGI Ads", "UGC Reels", "Cinematic Films", "4K Visuals"][Math.floor(Date.now() / 3000) % 4]}
                    </motion.div>
                  </div>

                  {/* Animated bars */}
                  <div className="w-full space-y-3">
                    {[["Rendering", "94%"], ["AI Processing", "78%"], ["4K Export", "61%"]].map(([label, pct]) => (
                      <div key={label} className="space-y-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>{label}</span><span className="text-gold">{pct}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gold-gradient"
                            initial={{ width: 0 }}
                            whileInView={{ width: pct }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Status pill */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-[10px] font-bold uppercase tracking-widest">Live Production</span>
                  </div>
                </div>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/40 rounded-tl-[2rem] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/40 rounded-br-[2rem] pointer-events-none" />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Cinematic3DSection;
