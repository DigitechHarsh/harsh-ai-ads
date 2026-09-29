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
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);

  // ── useMotionValue for parallax — ZERO React re-renders on mousemove ──
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 60, damping: 25 });
  const smoothY = useSpring(rawY, { stiffness: 60, damping: 25 });

  // Parallax layers derived from motion values
  const orbL_x  = useTransform(smoothX, v => v * -20);
  const orbL_y  = useTransform(smoothY, v => v * -12);
  const orbR_x  = useTransform(smoothX, v => v * 16);
  const orbR_y  = useTransform(smoothY, v => v * 10);
  const text_x  = useTransform(smoothX, v => v * -8);
  const text_y  = useTransform(smoothY, v => v * -4);
  const img_x   = useTransform(smoothX, v => v * 12);
  const img_y   = useTransform(smoothY, v => v * 6);

  // Image 3D tilt
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
    tiltX.set(((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -6);
    tiltY.set(((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * 8);
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
      className="relative pt-[62px] md:pt-[68px] overflow-hidden bg-black/40 min-h-fit"
      onMouseMove={onSectionMove}
    >
      {/* Animated grid */}
      <div className="absolute inset-0 grid-bg-animated opacity-60 pointer-events-none z-[1]" />
      <div className="scanline z-[2]" />

      <ParticleBackground />

      {/* Parallax orbs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-72 h-72 bg-gold/10 rounded-full blur-[80px] pointer-events-none"
        style={{ x: orbL_x, y: orbL_y }}
      />
      <motion.div
        className="absolute top-1/3 -right-20 w-60 h-60 bg-purple-500/8 rounded-full blur-[80px] pointer-events-none"
        style={{ x: orbR_x, y: orbR_y }}
      />

      {/* Top Banner Bars */}
      <div className="relative z-[45]">
        <ScrollingMarquee items={banners[0]?.marquee_text} />
        <OfferCounter />
      </div>

      <div className="embla w-full h-full relative z-10" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {banners.map((banner) => (
            <div key={banner.id} className="embla__slide flex-[0_0_100%] min-w-0 relative">
              <div className="container max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-4 lg:gap-8 items-center py-4 md:py-6 lg:py-8">

                {/* Left — text with gentle parallax (order-2 on mobile, order-1 on desktop) */}
                <motion.div
                  className="space-y-3 md:space-y-4 text-left z-10 p-1 md:p-2 order-2 md:order-1"
                  style={{ x: text_x, y: text_y }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {banner.is_offer && (
                      <motion.div
                        className="flex flex-wrap gap-2 mb-2 md:mb-3"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
                      >
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/25 text-gold text-[10px] font-bold uppercase tracking-widest">
                          <Sparkles className="w-3 h-3" />
                          Special Offer
                        </div>
                      </motion.div>
                    )}

                    {/* Heading — clean compact scale */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-[1.12] tracking-tight mb-2 md:mb-3">
                      {banner.title.split(' ').map((word: string, i: number) => {
                        const highlight = ['premium','ai','visuals','ads'].includes(word.toLowerCase().replace(/[^a-z]/g,''));
                        return (
                          <motion.span
                            key={i}
                            className="inline-block overflow-hidden mr-[0.2em]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.05 + i * 0.04 }}
                          >
                            <motion.span
                              className={`inline-block ${highlight ? 'shimmer-text' : ''}`}
                              initial={{ y: "100%" }}
                              animate={{ y: 0 }}
                              transition={{ delay: 0.05 + i * 0.04, duration: 0.5, ease: [0.16,1,0.3,1] }}
                            >
                              {word}{' '}
                            </motion.span>
                          </motion.span>
                        );
                      })}
                    </h1>

                    <motion.p
                      className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-lg leading-relaxed font-light mb-4 md:mb-5"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      {banner.subtitle}
                    </motion.p>

                    {/* CTA Buttons & Trust Badge */}
                    <motion.div
                      className="flex flex-wrap items-center gap-3"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <MagneticBtn href={banner.cta_link}>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gold-gradient rounded-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300 scale-105 blur-md" />
                          <Button size="default" className="relative bg-gold-gradient text-primary-foreground font-bold px-6 sm:px-8 py-5 rounded-xl text-sm md:text-base border-0 shadow-none">
                            {banner.cta_text}
                            <motion.span
                              className="ml-1.5 inline-block"
                              animate={{ x: [0, 3, 0] }}
                              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </motion.span>
                          </Button>
                        </div>
                      </MagneticBtn>

                      {/* Trust badge */}
                      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-gold text-gold" />)}
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground">25+ Brands Trust Us</span>
                      </div>
                    </motion.div>

                    {/* Compact Stats Row */}
                    <motion.div
                      className="flex gap-6 mt-4 md:mt-5 pt-3 border-t border-white/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      {[{ val: "4K", label: "Ultra HD" }].map((s, i) => (
                        <div key={i} className="text-left">
                          <div className="text-base sm:text-lg font-black text-gold-gradient font-display">{s.val}</div>
                          <div className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Right — banner image with 3D tilt (Fits completely above fold) */}
                <motion.div
                  ref={imgRef}
                  initial={{ opacity: 0, scale: 0.92, x: 40 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.16,1,0.3,1], delay: 0.2 }}
                  onMouseMove={onImgMove}
                  onMouseLeave={onImgLeave}
                  style={{ x: img_x, y: img_y }}
                  className="perspective-container relative w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-[16/10] sm:aspect-[4/3] md:aspect-[4/3] lg:aspect-[4/3] max-h-[360px] lg:max-h-[420px] mx-auto order-1 md:order-2"
                >
                  {/* Outer glow rings */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                      className="absolute w-[106%] h-[106%] rounded-full border border-gold/10"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    />
                  </div>

                  {/* Ambient glow */}
                  <div className="absolute inset-0 bg-gold/10 blur-[60px] rounded-full opacity-40 animate-pulse pointer-events-none" />

                  {/* Card with image */}
                  <motion.div
                    className="card-3d relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden border border-gold/30 shadow-2xl holographic bg-black"
                    style={{ rotateX: sTiltX, rotateY: sTiltY }}
                  >
                    {banner.media_type === "video"
                      ? <video src={banner.media_url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                      : <img src={banner.media_url} alt={banner.title} className="w-full h-full object-cover object-center" />
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-gold/40 rounded-tl-xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-gold/40 rounded-br-xl pointer-events-none" />

                    {/* Floating AI badge */}
                    <motion.div
                      className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-gold/30 rounded-lg px-2.5 py-1.5 pointer-events-none"
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-gold" />
                        <span className="text-[9px] font-black text-gold uppercase tracking-widest">AI Powered</span>
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
