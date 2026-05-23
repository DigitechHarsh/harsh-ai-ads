import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Upload, Sparkles, Send, Zap } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Images",
    description: "Fill the quick form and upload up to 5 high-quality images of your product.",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-500",
    glowColor: "rgba(6,182,212,0.4)",
    bgColor: "rgba(6,182,212,0.08)",
    borderColor: "rgba(6,182,212,0.2)",
    number: "01",
  },
  {
    icon: Sparkles,
    title: "AI Magic",
    description: "Our experts use premium AI models and advanced editing to transform your visuals.",
    gradientFrom: "from-gold",
    gradientTo: "to-amber-500",
    glowColor: "rgba(212,175,55,0.4)",
    bgColor: "rgba(212,175,55,0.08)",
    borderColor: "rgba(212,175,55,0.2)",
    number: "02",
  },
  {
    icon: Send,
    title: "Fast Delivery",
    description: "Get your high-converting AI ad delivered via WhatsApp within 24-48 hours.",
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-400",
    glowColor: "rgba(34,197,94,0.4)",
    bgColor: "rgba(34,197,94,0.08)",
    borderColor: "rgba(34,197,94,0.2)",
    number: "03",
  },
];

const StepCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const IconComponent = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotateX: 25, z: -100 * (index + 1) }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, z: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 text-center group perspective-near"
      whileHover="hover"
    >
      {/* Step number — big watermark */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[80px] font-black text-white/[0.02] font-display select-none pointer-events-none leading-none">
        {step.number}
      </div>

      {/* Step badge */}
      <motion.div
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border mb-6 mx-auto"
        style={{ borderColor: step.borderColor, backgroundColor: step.bgColor }}
        variants={{ hover: { scale: [1, 1.2, 1] } }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          variants={{ hover: { boxShadow: `0 0 0 8px ${step.glowColor.replace('0.4', '0.1')}` } }}
        />
        <span className="text-xs font-black" style={{ color: step.glowColor.replace('0.4', '0.9') }}>
          {index + 1}
        </span>
      </motion.div>

      {/* Main icon card */}
      <motion.div
        className="relative w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-8 overflow-hidden card-3d"
        style={{ backgroundColor: step.bgColor, border: `1px solid ${step.borderColor}` }}
        whileHover={{
          rotateY: 20,
          rotateX: -10,
          scale: 1.12,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          variants={{ hover: { boxShadow: `0 0 40px ${step.glowColor}, 0 0 80px ${step.glowColor.replace('0.4', '0.15')}` }, initial: { boxShadow: "none" } }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon */}
        <motion.div
          variants={{ hover: { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } }}
          transition={{ duration: 0.5 }}
        >
          <IconComponent className="w-10 h-10" style={{ color: step.glowColor.replace('0.4', '1') }} />
        </motion.div>

      </motion.div>

      {/* Text */}
      <motion.h3
        className="text-xl font-bold mb-4 transition-colors"
        variants={{ hover: { color: step.glowColor.replace('0.4', '1') }, initial: { color: "var(--foreground)" } }}
      >
        {step.title}
      </motion.h3>
      <p className="text-muted-foreground leading-relaxed text-sm md:text-base px-2 max-w-xs mx-auto">
        {step.description}
      </p>
    </motion.div>
  );
};

const ProcessSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingRotateX = useTransform(scrollYProgress, [0, 0.3], [30, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const lineProgress = useTransform(scrollYProgress, [0.2, 0.7], [0, 1]);

  return (
    <section id="process" ref={sectionRef} className="py-20 md:py-32 px-6 relative overflow-hidden">
      {/* Aurora bg */}
      <div className="absolute inset-0 aurora-bg opacity-40 pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}
      />

      <div className="container max-w-7xl mx-auto relative z-10">
        {/* 3D heading */}
        <motion.div
          style={{ rotateX: headingRotateX, opacity: headingOpacity }}
          className="text-center max-w-3xl mx-auto mb-20 perspective-near"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism-gold text-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
          >
            <Zap className="w-3 h-3" />
            Simple Process
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            How It <span className="shimmer-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our streamlined process ensures you get premium results with zero effort.
            From upload to final ad in just 3 simple steps.
          </p>
        </motion.div>

        <div className="relative">
          {/* Animated SVG connector */}
          <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-0.5 pointer-events-none overflow-visible">
            <svg className="w-full h-8 -mt-4" viewBox="0 0 600 20" preserveAspectRatio="none">
              {/* Static base line */}
              <line x1="0" y1="10" x2="600" y2="10" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              {/* Animated flow line */}
              <motion.line
                x1="0" y1="10" x2="600" y2="10"
                stroke="url(#flowGradient)"
                strokeWidth="1.5"
                strokeDasharray="8 12"
                style={{ pathLength: lineProgress }}
              />
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(6,182,212,0.8)" />
                  <stop offset="50%" stopColor="rgba(212,175,55,0.8)" />
                  <stop offset="100%" stopColor="rgba(34,197,94,0.8)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Glowing dots on connector */}
            {[0, 1].map(i => (
              <motion.div
                key={i}
                className="absolute top-0 -translate-y-1/2 w-2 h-2 rounded-full"
                style={{
                  left: `${i === 0 ? 33 : 66}%`,
                  backgroundColor: i === 0 ? "rgba(212,175,55,0.8)" : "rgba(34,197,94,0.8)",
                  boxShadow: `0 0 8px ${i === 0 ? "rgba(212,175,55,0.6)" : "rgba(34,197,94,0.6)"}`,
                }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 1 }}
              />
            ))}
          </div>

          {/* Step cards */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 perspective-container">
            {steps.map((step, index) => (
              <StepCard key={index} step={step} index={index} />
            ))}
          </div>
        </div>

        {/* Bottom CTA nudge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <a href="#form">
            <motion.button
              className="relative group inline-flex items-center gap-2 px-8 py-4 rounded-2xl glassmorphism-gold text-gold font-bold text-sm uppercase tracking-widest overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-10 transition-opacity"
              />
              <Sparkles className="w-4 h-4" />
              Start Your Order Now
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
