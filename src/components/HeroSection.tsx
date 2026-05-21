import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";
import heroProduct from "@/assets/hero-product.jpg";
import ScrollingMarquee from "./ScrollingMarquee";
import ParticleBackground from "./ParticleBackground";
import OfferCounter from "./OfferCounter";

const HeroSection = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 2000, stopOnInteraction: false })]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroMediaRef = useRef<HTMLDivElement>(null);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (!heroMediaRef.current) return;
    const rect = heroMediaRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({
      x: ((e.clientY - cy) / (rect.height / 2)) * -8,
      y: ((e.clientX - cx) / (rect.width / 2)) * 10,
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
          // Fallback banner if DB is empty
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
    <section className="relative pt-[72px] md:pt-[80px] overflow-hidden bg-black">
      <ParticleBackground />
      <div className="relative z-[45]">
        <ScrollingMarquee items={banners[0]?.marquee_text} />
        <OfferCounter />
      </div>
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden select-none opacity-20">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-gold/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="embla w-full h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {banners.map((banner) => (
            <div key={banner.id} className="embla__slide flex-[0_0_100%] min-w-0 relative">
              <div className="container max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center py-4 md:py-8">
                
                {/* Left Side: Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="space-y-8 text-left z-10 p-2"
                >
                  {banner.is_offer && (
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        <span>Special Offer</span>
                      </div>
                    </div>
                  )}

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight">
                    {banner.title.split(' ').map((word: string, i: number) => (
                       word.toLowerCase() === 'premium' || word.toLowerCase() === 'ai' || word.toLowerCase() === 'visuals' ? 
                       <span key={i} className="text-gold-gradient block sm:inline">{word} </span> : 
                       <span key={i}>{word} </span>
                    ))}
                  </h1>

                  <p className="text-muted-foreground text-lg md:text-xl max-w-lg leading-relaxed font-light">
                    {banner.subtitle}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <a href={banner.cta_link}>
                      <Button size="lg" className="bg-gold-gradient text-primary-foreground font-bold px-10 py-7 rounded-xl text-lg hover:scale-105 transition-transform group">
                        {banner.cta_text}
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                  </div>
                </motion.div>

                {/* Right Side: Media — 3D Tilt */}
                <motion.div
                  ref={heroMediaRef}
                  initial={{ opacity: 0, scale: 0.9, x: 50 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  onMouseMove={handleHeroMouseMove}
                  onMouseLeave={handleHeroMouseLeave}
                  className="perspective-container relative aspect-[4/5] md:aspect-square w-full max-w-xl mx-auto"
                >
                  <div className="absolute inset-0 bg-gold/10 blur-[80px] rounded-full opacity-30 animate-pulse" />
                  <div
                    className="card-3d relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden border border-gold/20 glow-gold-md shadow-2xl"
                    style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
                  >
                    {banner.media_type === "video" ? (
                      <video src={banner.media_url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                    ) : (
                      <img src={banner.media_url} alt={banner.title} className="w-full h-full object-cover" />
                    )}
                    {/* 3D depth overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />
                    {/* Corner accent */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/30 rounded-tl-2xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/30 rounded-br-2xl pointer-events-none" />
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
