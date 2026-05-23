import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Zap, TrendingUp, Rocket, Settings, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    title: "Starter Creative",
    duration: "6-12 sec",
    price: "₹999",
    description: "Best for testing and quick campaigns",
    icon: Zap,
    features: ["AI cinematic video", "Script + Scene", "2 revisions"],
    accentColor: "from-gold/20 to-amber-600/20",
    glowColor: "rgba(212,175,55,0.4)",
    borderColor: "rgba(212,175,55,0.3)",
    btnText: "Get Started",
  },
  {
    title: "Growth Creative",
    duration: "14-22 sec",
    price: "₹1499",
    description: "Ideal for performance ads",
    icon: TrendingUp,
    features: ["AI cinematic video", "Caption + Multiple Scenes", "2 revisions"],
    accentColor: "from-purple-500/20 to-pink-500/20",
    glowColor: "rgba(168,85,247,0.4)",
    borderColor: "rgba(168,85,247,0.3)",
    btnText: "Scale Now",
    popular: true,
  },
  {
    title: "Scale Creative",
    duration: "24-32 sec",
    price: "₹2099",
    description: "Built for scaling campaigns",
    icon: Rocket,
    features: ["AI cinematic video", "Caption + Multiple Scenes", "2 revisions"],
    accentColor: "from-cyan-500/20 to-blue-500/20",
    glowColor: "rgba(6,182,212,0.4)",
    borderColor: "rgba(6,182,212,0.3)",
    btnText: "Dominate Market",
  },
];

const PricingCard = ({ plan, index }: { plan: typeof pricingPlans[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 200, damping: 25 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

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

  const IconComponent = plan.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="perspective-container h-full flex"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover="hover"
        initial="initial"
        style={{ rotateX, rotateY }}
        className={`relative w-full h-full rounded-[2rem] p-8 flex flex-col glassmorphism border transition-colors duration-500 card-3d`}
        variants={{ hover: { borderColor: plan.borderColor } }}
      >
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold-gradient text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-10">
            Most Popular
          </div>
        )}

        <div className="flex flex-col items-center text-center flex-grow" style={{ transform: "translateZ(30px)" }}>
          <motion.div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.accentColor} border flex items-center justify-center mb-6 relative`}
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
            variants={{ hover: { scale: 1.1, rotate: [0, -10, 10, 0] } }}
          >
            <motion.div
              className="absolute inset-0 rounded-2xl"
              variants={{ hover: { boxShadow: `0 0 30px ${plan.glowColor}` }, initial: { boxShadow: "none" } }}
            />
            <IconComponent className="w-8 h-8 text-foreground" />
          </motion.div>

          <h3 className="text-2xl font-display font-bold text-gold-gradient mb-1">{plan.title}</h3>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">({plan.duration})</p>

          <div className="text-5xl font-black mb-2 flex items-baseline justify-center gap-1">
            <span className="text-3xl text-muted-foreground/50 font-medium"></span>
            {plan.price}
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mb-8 h-10">
            {plan.description}
          </p>

          <div className="w-full h-px bg-white/5 mb-8" />

          <div className="w-full space-y-4 mb-8 text-left flex-grow">
            <p className="text-sm font-bold text-foreground text-center mb-4">Includes</p>
            {plan.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-gold" />
                </div>
                <span className="text-sm text-foreground/80">{feature}</span>
              </div>
            ))}
          </div>

          <Button className="w-full mt-auto bg-white/5 hover:bg-gold hover:text-black border border-white/10 hover:border-gold transition-all duration-300 font-bold rounded-xl py-6">
            {plan.btnText}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AddonCard = ({ title, icon: Icon, description, delay }: { title: string, icon: any, description: string, delay: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 200, damping: 25 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="perspective-container h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover="hover"
        initial="initial"
        style={{ rotateX, rotateY }}
        className="w-full h-full glassmorphism rounded-3xl p-6 flex flex-col items-center justify-center text-center card-3d border border-white/5 hover:border-gold/30 transition-colors"
      >
        <motion.div
          className="mb-4 text-gold"
          variants={{ hover: { scale: 1.1, rotate: [0, 10, -10, 0] } }}
          transition={{ duration: 0.5 }}
          style={{ transform: "translateZ(20px)" }}
        >
          <Icon className="w-10 h-10 mx-auto" strokeWidth={1.5} />
        </motion.div>
        
        <h4 className="font-bold text-lg mb-2 text-gold-gradient" style={{ transform: "translateZ(15px)" }}>{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed" style={{ transform: "translateZ(10px)" }}>{description}</p>
      </motion.div>
    </motion.div>
  );
};

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative bg-background overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glassmorphism-gold text-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
          >
            Pricing
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-black mb-4"
          >
            Creative <span className="text-gold-gradient">Packages</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Transparent pricing for high-converting cinematic ads. No hidden fees.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main 3 Plans */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, idx) => (
              <PricingCard key={plan.title} plan={plan} index={idx} />
            ))}
          </div>

          {/* Add-ons Column */}
          <div className="flex flex-col gap-6">
            <div className="flex-1">
              <AddonCard 
                title="Custom Creative (40+ sec)"
                icon={Settings}
                description="Tailored based on concept, duration, and complexity"
                delay={0.4}
              />
            </div>
            <div className="flex-1">
              <AddonCard 
                title="Additional Revisions"
                icon={RefreshCw}
                description="₹299 per revision after standard included revisions."
                delay={0.5}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
