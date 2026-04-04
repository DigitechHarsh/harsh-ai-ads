import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import heroProduct from "@/assets/hero-product.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <motion.img
        src={logo}
        alt="Harsh AI Creations"
        width={160}
        height={160}
        className="w-28 md:w-40 mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      />

      <motion.h1
        className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-center max-w-4xl leading-tight"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Make Your Product Look{" "}
        <span className="text-gold-gradient">Premium</span> with Cinematic Ads
      </motion.h1>

      <motion.p
        className="mt-5 text-muted-foreground text-base md:text-lg text-center max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        High-converting AI ads that turn simple products into luxury visuals
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <a
          href="#form"
          className="bg-gold-gradient text-primary-foreground font-semibold px-8 py-4 rounded-lg text-lg hover:opacity-90 transition-opacity animate-pulse-glow text-center"
        >
          Get Your Ad for ₹399
        </a>
        <a
          href="#samples"
          className="border border-gold/30 text-foreground font-medium px-8 py-4 rounded-lg text-lg hover:border-gold/60 transition-colors text-center"
        >
          View Samples
        </a>
      </motion.div>

      <motion.div
        className="mt-12 w-full max-w-4xl rounded-xl overflow-hidden border border-border glow-gold-sm"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <img
          src={heroProduct}
          alt="Cinematic product advertisement example"
          width={1920}
          height={1080}
          className="w-full h-auto"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
