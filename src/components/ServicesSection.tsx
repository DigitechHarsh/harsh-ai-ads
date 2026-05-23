import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Video, Camera, Sparkles, Monitor, Layers, Film, ArrowRight } from "lucide-react";

const services = [
  {
    title: "AI Video Ads",
    icon: Video,
    description: "High-impact video content designed to stop the scroll and drive action.",
    categories: [
      { name: "CGI AI Ads", desc: "Hyper-realistic product renders in surreal environments.", icon: Layers },
      { name: "UGC AI Ads", desc: "Relatable, human-centric content with an AI edge.", icon: Monitor },
      { name: "Cinematic Ads", desc: "Premium story-driven production quality.", icon: Film },
    ],
    highlight: "4K ULTRA HD",
    accentColor: "from-gold/20 to-amber-600/20",
    glowColor: "rgba(212,175,55,0.15)",
    borderGlow: "rgba(212,175,55,0.3)",
  },
  {
    title: "AI Image Ads",
    icon: Camera,
    description: "Studio-quality product photography that looks like it cost thousands.",
    categories: [
      { name: "Studio Renders", desc: "Clean, professional product shots.", icon: Sparkles },
      { name: "Lifestyle Scenes", desc: "Products integrated into high-end life scenes.", icon: Sparkles },
      { name: "Creative Art", desc: "Conceptual visuals that push brand boundaries.", icon: Sparkles },
    ],
    highlight: "4K HIGH RES",
    accentColor: "from-purple-500/20 to-cyan-500/20",
    glowColor: "rgba(139,92,246,0.12)",
    borderGlow: "rgba(139,92,246,0.3)",
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 200, damping: 25 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const IconComponent = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: index === 0 ? -80 : 80, rotateY: index === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
      className="perspective-container"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover="hover"
        initial="initial"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative group cursor-default card-depth holographic gradient-border border-trace-wrap"
      >
        {/* Glass card body */}
        <div className="relative p-8 md:p-12 rounded-[2rem] glassmorphism overflow-hidden">

          {/* Dynamic spotlight follow */}
          <motion.div
            className="absolute inset-0 rounded-[2rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${service.glowColor} 0%, transparent 60%)`,
            }}
          />

          {/* Background gradient orb */}
          <div className={`absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br ${service.accentColor} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

          {/* 4K Badge */}
          <motion.div
            className="absolute top-8 right-8"
            variants={{ hover: { scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] } }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gold rounded-full blur-md opacity-50" />
              <div className="relative bg-gold text-black text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase">
                {service.highlight}
              </div>
            </div>
          </motion.div>

          <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
            {/* Icon with 3D pop */}
            <motion.div
              className={`mb-8 p-5 bg-gradient-to-br ${service.accentColor} border border-white/10 rounded-2xl w-fit relative`}
              variants={{ hover: { rotateY: [0, 15, -15, 0], scale: 1.1 }, initial: { rotateY: 0, scale: 1 } }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <IconComponent className="w-9 h-9 text-gold" />
              <motion.div
                className="absolute inset-0 rounded-2xl"
                variants={{ hover: { boxShadow: `0 0 30px ${service.glowColor}` }, initial: { boxShadow: "none" } }}
              />
            </motion.div>

            <h3 className="text-3xl font-display font-bold mb-4 group-hover:text-gold transition-colors duration-300">
              {service.title}
            </h3>
            <p className="text-muted-foreground mb-10 text-lg leading-relaxed">{service.description}</p>

            <div className="grid gap-3">
              {service.categories.map((cat, i) => {
                const CatIcon = cat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    whileHover={{ x: 6, backgroundColor: "rgba(212,175,55,0.06)" }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] transition-all duration-300 group/cat cursor-pointer"
                  >
                    <div className="p-2 bg-gold/10 text-gold rounded-lg flex-shrink-0 group-hover/cat:bg-gold/20 transition-colors">
                      <CatIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm text-foreground group-hover/cat:text-gold transition-colors">{cat.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover/cat:text-gold group-hover/cat:translate-x-1 transition-all" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      {/* Aurora ambient background */}
      <div className="absolute inset-0 aurora-bg opacity-50 pointer-events-none" />

      {/* Decorative grid */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Ambient orbs */}
      <motion.div
        className="absolute top-0 right-0 w-1/3 h-1/3 bg-gold/6 blur-[150px] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/6 blur-[150px] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: -4 }}
      />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glassmorphism-gold text-gold text-[10px] font-bold uppercase tracking-[0.25em] mb-6"
          >
            <Sparkles className="w-3 h-3" />
            What We Deliver
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            Our AI <span className="shimmer-text">Expertise</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            We specialize in creating high-resolution visuals that redefine how brands communicate.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* Quality Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 relative overflow-hidden rounded-3xl"
        >
          <div className="bg-gold-gradient p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
            {/* Scanline overlay */}
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)" }}
            />
            <div className="flex items-center gap-4 relative z-10">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Monitor className="w-10 h-10 text-black" />
              </motion.div>
              <div>
                <h4 className="font-black text-xl uppercase tracking-tight text-black">4K Ultra-High Resolution</h4>
                <p className="text-black/70 font-medium">Standard for all image and video deliveries.</p>
              </div>
            </div>
            <div className="flex gap-3 relative z-10">
              {[1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-black rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
