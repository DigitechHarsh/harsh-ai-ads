import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, Rocket, Settings, RefreshCw, Check, Clock, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    title: "Starter Creative",
    duration: "6-12 sec",
    price: "₹999",
    description: "Best for testing and quick campaigns",
    icon: Zap,
    features: [
      "1 AI Cinematic Video",
      "Basic Script Writing",
      "Standard 1080p Export",
      "2 Revisions"
    ],
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
    features: [
      "1 AI Cinematic Video",
      "Engaging Script & Captions",
      "4K Ultra HD Export",
      "Premium BGM Track",
      "2 Revisions"
    ],
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
    features: [
      "1 AI Cinematic Video",
      "Advanced Storytelling",
      "4K Ultra HD + Color Grading",
      "Premium BGM + AI Voiceover",
      "2 Revisions"
    ],
    accentColor: "from-cyan-500/20 to-blue-500/20",
    glowColor: "rgba(6,182,212,0.4)",
    borderColor: "rgba(6,182,212,0.3)",
    btnText: "Dominate Market",
  },
];

const monthlyPlans = [
  {
    price: "₹7999",
    duration: "150 seconds",
    creatives: "Maximum 12 creatives",
    delay: 0.1
  },
  {
    price: "₹14999",
    duration: "350 seconds",
    creatives: "Maximum 20 creatives",
    delay: 0.2
  }
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
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.5, delay }}
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

const MonthlyCard = ({ plan }: { plan: typeof monthlyPlans[0] }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 200, damping: 25 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5, delay: plan.delay }}
      className="perspective-container"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover="hover"
        initial="initial"
        style={{ rotateX, rotateY }}
        className="glassmorphism rounded-3xl p-8 flex flex-col items-center justify-center text-center card-3d border border-white/5 hover:border-gold/30 transition-colors relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gold/5"
          variants={{ hover: { opacity: 1 }, initial: { opacity: 0 } }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
          <h3 className="text-3xl font-display font-black text-gold-gradient mb-4">
            {plan.price} <span className="text-lg text-muted-foreground font-medium">/ month</span>
          </h3>
          
          <div className="flex items-center gap-2 text-foreground/90 justify-center mb-2">
            <Clock className="w-4 h-4 text-gold" />
            <span className="font-bold">{plan.duration}</span> of total duration
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground text-sm justify-center">
            <Layers className="w-4 h-4" />
            <span>({plan.creatives})</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PricingSection = () => {
  const [isMonthly, setIsMonthly] = useState(false);

  return (
    <section id="pricing" className="py-24 relative bg-background overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
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
            className="text-4xl md:text-5xl font-display font-black mb-6"
          >
            Creative <span className="text-gold-gradient">Packages</span>
          </motion.h2>

          {/* Toggle Switch */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <span className={`text-sm font-bold transition-colors ${!isMonthly ? "text-gold" : "text-muted-foreground"}`}>Individual Ads</span>
            
            <button 
              onClick={() => setIsMonthly(!isMonthly)}
              className="relative w-16 h-8 rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center px-1 cursor-pointer hover:border-gold/50 transition-colors"
            >
              <motion.div 
                className="w-6 h-6 rounded-full bg-gold-gradient"
                animate={{ x: isMonthly ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            </button>
            
            <span className={`text-sm font-bold transition-colors flex items-center gap-2 ${isMonthly ? "text-gold" : "text-muted-foreground"}`}>
              Monthly Partnership
              <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded-full uppercase tracking-widest border border-green-500/20">Save ~50%</span>
            </span>
          </motion.div>
        </div>

        <div className="min-h-[600px] relative">
          <AnimatePresence mode="wait">
            {!isMonthly ? (
              <motion.div 
                key="individual"
                className="grid grid-cols-1 lg:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
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
                      delay={0.2}
                    />
                  </div>
                  <div className="flex-1">
                    <AddonCard 
                      title="Additional Revisions"
                      icon={RefreshCw}
                      description="₹299 per revision after standard included revisions."
                      delay={0.3}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="monthly"
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-center pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Left Side: Cards */}
                <div className="flex flex-col gap-8">
                  {monthlyPlans.map((plan, idx) => (
                    <MonthlyCard key={idx} plan={plan} />
                  ))}
                </div>

                {/* Right Side: Info Text */}
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <h3 className="text-4xl md:text-5xl font-display font-black text-gold-gradient uppercase tracking-tight leading-tight">
                    Monthly Creative Partnership
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-gold" />
                      </div>
                      <p className="text-lg text-foreground/90">Consistent creatives for better performance and faster scaling</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-gold" />
                      </div>
                      <p className="text-lg text-foreground/90">Flexible plans based on your creative needs</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5">
                    <p className="text-xs text-muted-foreground">
                      *Individual ads average ₹85/sec. Monthly Partnership tiers drop the cost to ~₹42-₹53/sec, offering up to 50% bulk discount.
                    </p>
                  </div>
                  
                  <Button size="lg" className="mt-4 bg-gold-gradient text-black font-bold px-10 py-6 rounded-xl text-lg w-full sm:w-auto hover:scale-105 transition-transform">
                    Discuss Partnership
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
