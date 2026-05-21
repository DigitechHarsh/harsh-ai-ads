import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Upload, Sparkles, Send } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Images",
    description: "Fill the quick form and upload up to 5 high-quality images of your product.",
    color: "from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-500/20",
  },
  {
    icon: Sparkles,
    title: "AI Magic",
    description: "Our experts use premium AI models and advanced editing to transform your visuals.",
    color: "from-gold/20 to-yellow-600/20",
    borderColor: "border-gold/20",
  },
  {
    icon: Send,
    title: "Fast Delivery",
    description: "Get your high-converting AI ad delivered via WhatsApp within 24-48 hours.",
    color: "from-green-500/20 to-emerald-600/20",
    borderColor: "border-green-500/20",
  },
];

const ProcessSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // 3D staircase depth — heading flips in from X axis
  const headingRotateX = useTransform(scrollYProgress, [0, 0.3], [25, 0]);
  const headingOpacity  = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  return (
    <section id="process" ref={sectionRef} className="py-16 md:py-24 px-6 relative overflow-hidden bg-secondary/10">
      {/* Dot grid background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
      />

      <div className="container max-w-7xl mx-auto relative z-10">
        {/* 3D Flip-in heading */}
        <motion.div
          style={{ rotateX: headingRotateX, opacity: headingOpacity }}
          className="text-center max-w-3xl mx-auto mb-16 perspective-near"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 italic">
            How It <span className="text-gold-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our streamlined process ensures you get premium results with zero effort.
            From upload to final ad in just 3 simple steps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative perspective-container">
          {/* Connector line */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/20 to-transparent z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 60,
                z: -80 * (index + 1),
                rotateX: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                z: 0,
                rotateX: 0,
              }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative z-10 text-center group perspective-near"
            >
              {/* Step number */}
              <div className="w-8 h-8 rounded-full bg-background border border-gold/30 flex items-center justify-center text-xs font-bold text-gold mx-auto mb-4">
                0{index + 1}
              </div>

              {/* Icon box with 3D hover */}
              <motion.div
                whileHover={{ rotateY: 15, rotateX: -10, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} border ${step.borderColor} flex items-center justify-center mb-8 shadow-2xl relative card-3d`}
              >
                <step.icon className="w-10 h-10 text-gold" />
                <div className="absolute inset-0 bg-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl -z-10" />
              </motion.div>

              <h3 className="text-xl font-bold mb-4 group-hover:text-gold transition-colors">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base px-2">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
