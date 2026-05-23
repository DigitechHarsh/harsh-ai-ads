import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Zap, Star } from "lucide-react";
import heroProduct from "@/assets/hero-product.jpg";
import ScrollingMarquee from "./ScrollingMarquee";
import ParticleBackground from "./ParticleBackground";
import OfferCounter from "./OfferCounter";

// ── Magnetic Button — uses motion values, zero re-renders ──
const MagneticBtn = ({ children, href }: { children: React.ReactNode; href: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 20 });
  const sy = useSpring(y, { stiffness: 250, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top  - r.height / 2) * 0.3);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">
      <motion.a href={href} style={{ x: sx, y: sy }} className="inline-block">
        {children}
      </motion.a>
    </div>
  );
};

const HeroSection = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000, stopOnInteraction: false })]);

  // ── useMotionValue for parallax — ZERO React re-renders on mousemove ──
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 60, damping: 25 });
  const smoothY = useSpring(rawY, { stiffness: 60, damping: 25 });

  // Parallax layers derived from motion values
  const orbL_x  = useTransform(smoothX, v => v * -28);
  const orbL_y  = useTransform(smoothY, v => v * -18);
  const orbR_x  = useTransform(smoothX, v => v * 22);
  const orbR_y  = useTransform(smoothY, v => v * 14);
  const text_x  = useTransform(smoothX, v => v * -12);
  const text_y  = useTransform(smoothY, v => v * -6);
  const img_x   = useTransform(smoothX, v => v * 18);
  const img_y   = useTransform(smoothY, v => v * 10);

  // Image 3D tilt (separate motion values)
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const sTiltX = useSpring(tiltX, { stiffness: 200, damping: 22 });
  const sTiltY = useSpring(tiltY, { stiffness: 200, damping: 22 });
  const imgRef = useRef<HTMLDivElement>(null);

  const sectionRef = useRef<HTMLElement>(null);
  let rafId = 0;

  const onSectionMove = (e: React.MouseEvent<HTMLElement>) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      if (!sectionRef.current) return;
      const r = sectionRef.current.getBoundingClientRect();
      rawX.set((e.clientX - r.left) / r.width - 0.5);
      rawY.set((e.clientY - r.top)  / r.height - 0.5);
    });
  };

  const onImgMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const r = imgRef.current.getBoundingClientRect();
    tiltX.set(((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -8);
    tiltY.set(((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * 10);
  };
  const onImgLeave = () => { tiltX.set(0); tiltY.set(0); };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/hero");
        const data = await res.json();
        setBanners(data?.length > 0 ? data : [defaultBanner]);
      } catch { setBanners([defaultBanner]); }
    };
    load();
    return () => cancelAnimationFrame(rafId);
  }, []);

  const defaultBanner = {
    id: 'default',
    title: "Make Your Product Look PREMIUM with AI Ads",
    subtitle: "High-converting 6-12 second AI ads that turn simple products into luxury visuals",
    cta_text: "Get Your Ad Now",
    cta_link: "#form",
    media_url: heroProduct,
    media_type: "image",
  };

  return (
    <section
      ref={sectionRef}
      className="relative pt-[72px] md:pt-[80px] overflow-hidden bg-black"
      onMouseMove={onSectionMove}
    >
      {/* Animated grid — CSS only, no JS */}
      <div className="absolute inset-0 grid-bg-animated opacity-100 pointer-events-none z-[1]" />

      {/* Scanline — pure CSS, no JS */}
      <div className="scanline z-[2]" />

      <ParticleBackground />

      {/* Parallax orbs — motion values, no re-renders */}
      <motion.div
        className="absolute top-1/4 -left-20 w-80 h-80 bg-gold/12 rounded-full blur-[90px] pointer-events-none"
        style={{ x: orbL_x, y: orbL_y }}
      />
      <motion.div
        className="absolute top-1/3 -right-20 w-64 h-64 bg-purple-500/8 rounded-full blur-[90px] pointer-events-none"
        style={{ x: orbR_x, y: orbR_y }}
      />

      <div className="relative z-[45]">
        <ScrollingMarquee items={banners[0]?.marquee_text} />
        <OfferCounter />
      </div>

      <div className="embla w-full h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {banners.map((banner) => (
            <div key={banner.id} className="embla__slide flex-[0_0_100%] min-w-0 relative">
              <div className="container max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center py-8 md:py-16">

                {/* Left — text with gentle parallax */}
                <motion.div
                  className="space-y-8 text-left z-10 p-2"
                  style={{ x: text_x, y: text_y }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    {banner.is_offer && (
                      <motion.div
                        className="flex flex-wrap gap-2 mb-6"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
                      >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-[10px] font-bold uppercase tracking-widest">
                          <Sparkles className="w-3 h-3" />
                          Special Offer
                        </div>
                      </motion.div>
                    )}

                    {/* Heading — word reveal */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight mb-6">
                      {banner.title.split(' ').map((word: string, i: number) => {
                        const highlight = ['premium','ai','visuals','ads'].includes(word.toLowerCase().replace(/[^a-z]/g,''));
                        return (
                          <motion.span
                            key={i}
                            className="inline-block overflow-hidden mr-[0.25em]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 + i * 0.07 }}
                          >
                            <motion.span
                              className={`inline-block ${highlight ? 'shimmer-text' : ''}`}
                              initial={{ y: "110%" }}
                              animate={{ y: 0 }}
                              transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: [0.16,1,0.3,1] }}
                            >
                              {word}{' '}
                            </motion.span>
                          </motion.span>
                        );
                      })}
                    </h1>

                    <motion.p
                      className="text-muted-foreground text-lg md:text-xl max-w-lg leading-relaxed font-light mb-8"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    >
                      {banner.subtitle}
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                      className="flex flex-col sm:flex-row gap-4"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                    >
                      <MagneticBtn href={banner.cta_link}>
                        <div className="relative group">
                          {/* Glow — opacity transition only (GPU-friendly) */}
                          <div className="absolute inset-0 bg-gold-gradient rounded-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300 scale-110 blur-lg" />
                          <Button size="lg" className="relative bg-gold-gradient text-primary-foreground font-bold px-10 py-7 rounded-xl text-lg border-0 shadow-none">
                            {banner.cta_text}
                            <motion.span
                              className="ml-2 inline-block"
                              animate={{ x: [0, 4, 0] }}
                              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                            >
                              <ChevronRight className="w-5 h-5" />
                            </motion.span>
                          </Button>
                        </div>
                      </MagneticBtn>

                      {/* Trust badge */}
                      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-gold text-gold" />)}
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">25+ Brands Trust Us</span>
                      </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                      className="flex gap-6 mt-8 pt-8 border-t border-white/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                    >
                      {[{ val: "4K", label: "Ultra HD" }, { val: "24h", label: "Delivery" }, { val: "₹399", label: "Starting" }].map((s, i) => (
                        <div key={i} className="text-center">
                          <div className="text-xl font-black text-gold-gradient font-display">{s.val}</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{s.label}</div>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Right — image with 3D tilt */}
                <motion.div
                  ref={imgRef}
                  initial={{ opacity: 0, scale: 0.88, x: 60 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 1, ease: [0.16,1,0.3,1], delay: 0.2 }}
                  onMouseMove={onImgMove}
                  onMouseLeave={onImgLeave}
                  style={{ x: img_x, y: img_y }}
                  className="perspective-container relative aspect-[4/5] md:aspect-square w-full max-w-xl mx-auto"
                >
                  {/* Outer glow rings — CSS animation only */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                      className="absolute w-[112%] h-[112%] rounded-full border border-gold/8"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute w-[128%] h-[128%] rounded-full border border-purple-500/5"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    />
                  </div>

                  {/* Ambient glow — opacity pulse only */}
                  <div className="absolute inset-0 bg-gold/12 blur-[90px] rounded-full opacity-40 animate-pulse pointer-events-none" />

                  {/* Card — tilt via motion values, no state */}
                  <motion.div
                    className="card-3d relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden border border-gold/20 shadow-2xl holographic"
                    style={{ rotateX: sTiltX, rotateY: sTiltY }}
                  >
                    {banner.media_type === "video"
                      ? <video src={banner.media_url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                      : <img src={banner.media_url} alt={banner.title} className="w-full h-full object-cover" />
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/4 to-transparent pointer-events-none" />
                    <div className="absolute top-0 left-0 w-14 h-14 border-t-2 border-l-2 border-gold/35 rounded-tl-2xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-14 h-14 border-b-2 border-r-2 border-gold/35 rounded-br-2xl pointer-events-none" />

                    {/* Floating AI badge */}
                    <motion.div
                      className="absolute top-4 right-4 bg-gold/10 border border-gold/25 rounded-xl px-3 py-2 pointer-events-none"
                      animate={{ y: [-4, 4, -4] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-gold" />
                        <span className="text-[10px] font-black text-gold uppercase tracking-widest">AI Powered</span>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
