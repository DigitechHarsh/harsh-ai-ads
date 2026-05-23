import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Zap, Star } from "lucide-react";
import logo from "@/assets/logo.png";
import heroProduct from "@/assets/hero-product.jpg";
import ScrollingMarquee from "./ScrollingMarquee";
import ParticleBackground from "./ParticleBackground";
import OfferCounter from "./OfferCounter";

// Word-by-word reveal animation
const WordReveal = ({ text, className = "" }: { text: string; className?: string }) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block overflow-hidden mr-[0.25em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.08, duration: 0.01 }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: "120%", rotateX: -20 }}
            animate={{ y: 0, rotateX: 0 }}
            transition={{
              delay: i * 0.08,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
};

// Magnetic Button wrapper
const MagneticBtn = ({ children, href }: { children: React.ReactNode; href: string }) => {
  const btnRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 300, damping: 20 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.4);
    y.set((e.clientY - cy) * 0.4);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <div ref={btnRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="inline-block">
      <motion.a href={href} style={{ x: springX, y: springY }} className="inline-block">
        {children}
      </motion.a>
    </div>
  );
};

// Floating orb component
const FloatingOrb = ({ className }: { className?: string }) => (
  <div className={`absolute rounded-full pointer-events-none blur-[80px] opacity-20 ${className}`} />
);

const HeroSection = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000, stopOnInteraction: false })]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroMediaRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax mouse tracking
  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (!heroMediaRef.current) return;
    const rect = heroMediaRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({
      x: ((e.clientY - cy) / (rect.height / 2)) * -10,
      y: ((e.clientX - cx) / (rect.width / 2)) * 12,
    });
  };
  const handleHeroMouseLeave = () => setTilt({ x: 0, y: 0 });

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/hero");
        const data = await res.json();
        if (data && data.length > 0) {
          setBanners(data);
        } else {
          setBanners([{
            id: 'default',
            title: "Make Your Product Look PREMIUM with AI Ads",
            subtitle: "High-converting 6-12 second AI ads that turn simple products into luxury visuals",
            cta_text: "Get Your Ad Now",
            cta_link: "#form",
            media_url: heroProduct,
            media_type: "image"
          }]);
        }
      } catch (e) {
        setBanners([{
          id: 'default',
          title: "Make Your Product Look PREMIUM with AI Ads",
          subtitle: "High-converting 6-12 second AI ads that turn simple products into luxury visuals",
          cta_text: "Get Your Ad Now",
          cta_link: "#form",
          media_url: heroProduct,
          media_type: "image"
        }]);
      }
    };
    fetchBanners();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pt-[72px] md:pt-[80px] overflow-hidden bg-black"
      onMouseMove={handleSectionMouseMove}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg-animated opacity-100 pointer-events-none z-[1]" />

      {/* Scanline effect */}
      <div className="scanline z-[2]" />

      <ParticleBackground />

      {/* Floating orbs — parallax driven */}
      <motion.div
        className="absolute top-1/4 -left-20 w-96 h-96 bg-gold/15 rounded-full blur-[100px] pointer-events-none"
        animate={{
          x: mousePos.x * -30,
          y: mousePos.y * -20,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
      <motion.div
        className="absolute top-1/3 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"
        animate={{
          x: mousePos.x * 25,
          y: mousePos.y * 15,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-72 h-72 bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none"
        animate={{
          x: mousePos.x * 15,
          y: mousePos.y * -25,
        }}
        transition={{ type: "spring", stiffness: 30, damping: 20 }}
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

                {/* Left Side: Content with Parallax */}
                <motion.div
                  className="space-y-8 text-left z-10 p-2"
                  style={{
                    x: mousePos.x * -15,
                    y: mousePos.y * -8,
                  }}
                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {banner.is_offer && (
                      <motion.div
                        className="flex flex-wrap gap-2 mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glassmorphism-gold text-gold text-[10px] font-bold uppercase tracking-widest pulse-ring">
                          <Sparkles className="w-3 h-3" />
                          <span>Special Offer</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Animated heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight mb-6">
                      {banner.title.split(' ').map((word: string, i: number) => {
                        const isHighlight = ['premium', 'ai', 'visuals', 'ads'].includes(word.toLowerCase().replace(/[^a-z]/g, ''));
                        return (
                          <motion.span
                            key={i}
                            className={`inline-block overflow-hidden mr-[0.25em] ${isHighlight ? '' : ''}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 + i * 0.07 }}
                          >
                            <motion.span
                              className={`inline-block ${isHighlight ? 'shimmer-text' : ''}`}
                              initial={{ y: "110%", rotateX: -15 }}
                              animate={{ y: 0, rotateX: 0 }}
                              transition={{
                                delay: 0.1 + i * 0.07,
                                duration: 0.65,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            >
                              {word}{' '}
                            </motion.span>
                          </motion.span>
                        );
                      })}
                    </h1>

                    <motion.p
                      className="text-muted-foreground text-lg md:text-xl max-w-lg leading-relaxed font-light mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    >
                      {banner.subtitle}
                    </motion.p>

                    {/* Magnetic CTA Button */}
                    <motion.div
                      className="flex flex-col sm:flex-row gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                    >
                      <MagneticBtn href={banner.cta_link}>
                        <motion.div
                          className="relative group"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <div className="absolute inset-0 bg-gold-gradient rounded-xl blur-lg opacity-60 group-hover:opacity-90 transition-opacity scale-110" />
                          <Button
                            size="lg"
                            className="relative bg-gold-gradient text-primary-foreground font-bold px-10 py-7 rounded-xl text-lg border-0 shadow-none"
                          >
                            {banner.cta_text}
                            <motion.span
                              className="ml-2 inline-block"
                              animate={{ x: [0, 4, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            >
                              <ChevronRight className="w-5 h-5" />
                            </motion.span>
                          </Button>
                        </motion.div>
                      </MagneticBtn>

                      {/* Trust badge */}
                      <motion.div
                        className="flex items-center gap-2 px-4 py-3 glassmorphism rounded-xl"
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">25+ Brands Trust Us</span>
                      </motion.div>
                    </motion.div>

                    {/* Floating stats */}
                    <motion.div
                      className="flex gap-6 mt-8 pt-8 border-t border-white/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                    >
                      {[
                        { val: "4K", label: "Ultra HD" },
                        { val: "24h", label: "Delivery" },
                        { val: "₹399", label: "Starting" },
                      ].map((stat, i) => (
                        <div key={i} className="text-center">
                          <div className="text-xl font-black text-gold-gradient font-display">{stat.val}</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Right Side: Media — Enhanced 3D Tilt with parallax */}
                <motion.div
                  ref={heroMediaRef}
                  initial={{ opacity: 0, scale: 0.85, x: 60 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  onMouseMove={handleHeroMouseMove}
                  onMouseLeave={handleHeroMouseLeave}
                  style={{
                    x: mousePos.x * 20,
                    y: mousePos.y * 12,
                  }}
                  className="perspective-container relative aspect-[4/5] md:aspect-square w-full max-w-xl mx-auto cursor-none"
                >
                  {/* Glow rings */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                      className="absolute w-[110%] h-[110%] rounded-full border border-gold/10"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute w-[125%] h-[125%] rounded-full border border-purple-500/5"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    />
                  </div>

                  <div className="absolute inset-0 bg-gold/15 blur-[100px] rounded-full opacity-40 animate-pulse pointer-events-none" />

                  <div
                    className="card-3d relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden border border-gold/20 glow-gold-md shadow-2xl holographic"
                    style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
                  >
                    {banner.media_type === "video" ? (
                      <video src={banner.media_url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                    ) : (
                      <img src={banner.media_url} alt={banner.title} className="w-full h-full object-cover" />
                    )}
                    {/* 3D depth overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-purple-500/5 pointer-events-none" />

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/40 rounded-tl-2xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/40 rounded-br-2xl pointer-events-none" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-purple-500/20 rounded-tr-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-500/20 rounded-bl-2xl pointer-events-none" />

                    {/* Floating badge on image */}
                    <motion.div
                      className="absolute top-4 right-4 glassmorphism-gold rounded-xl px-3 py-2 pointer-events-none"
                      animate={{ y: [-4, 4, -4] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-gold" />
                        <span className="text-[10px] font-black text-gold uppercase tracking-widest">AI Powered</span>
                      </div>
                    </motion.div>
                  </div>
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
