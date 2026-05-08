import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

const BeforeAfterSlider = ({ beforeImage, afterImage }: BeforeAfterSliderProps) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(x, 0), 100));
  };

  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-bold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            THE TRANSFORMATION
          </motion.div>
          <h2 className="text-3xl md:text-6xl font-display font-bold mb-6">
            From Ordinary to <span className="text-gold-gradient">Masterpiece</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Slide to see how we turn your raw smartphone photos into hyper-realistic, high-converting cinematic ads.
          </p>
        </div>

        <div 
          ref={containerRef}
          className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border-2 border-border/50 shadow-2xl cursor-ew-resize group select-none"
          onMouseMove={onMouseMove}
          onTouchMove={onTouchMove}
        >
          {/* After Image (Background) */}
          <img 
            src={afterImage} 
            alt="After" 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Before Image (Foreground Clip) */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <img 
              src={beforeImage} 
              alt="Before" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Labels */}
          <div className="absolute top-6 left-6 z-20 pointer-events-none">
            <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
              Before
            </span>
          </div>
          <div className="absolute top-6 right-6 z-20 pointer-events-none text-right">
            <span className="bg-gold/80 backdrop-blur-md text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full border border-gold/20 uppercase tracking-widest">
              After (AI Ad)
            </span>
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute inset-y-0 z-30 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-10 h-10 rounded-full bg-white text-black shadow-xl flex items-center justify-center border-4 border-gold/20">
              <MoveHorizontal className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <h4 className="font-bold text-gold">1. Your Photo</h4>
            <p className="text-sm text-muted-foreground">Just a simple click from your phone. No studio needed.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <h4 className="font-bold text-gold">2. Our AI Magic</h4>
            <p className="text-sm text-muted-foreground">We re-imagine lighting, textures, and environments.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h4 className="font-bold text-gold">3. Global Quality</h4>
            <p className="text-sm text-muted-foreground">Results that stand out against billion-dollar brands.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;
