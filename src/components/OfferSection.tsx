import { motion } from "framer-motion";
import { Zap, Clock } from "lucide-react";

const OfferSection = () => (
  <section className="py-20 px-4">
    <div className="container max-w-3xl">
      <motion.div
        className="relative bg-card border-2 border-gold/40 rounded-2xl p-8 md:p-12 text-center overflow-hidden glow-gold"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent bg-[length:200%_100%] animate-shimmer pointer-events-none" />

        <Zap className="w-10 h-10 text-gold mx-auto mb-4" />
        <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">
          First 20 Clients — Get Your Cinematic Ad for Just{" "}
          <span className="text-gold-gradient text-3xl md:text-5xl">₹399</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-2">
          High-quality 6-12 second ad • 2 revisions included
        </p>

        <div className="flex items-center justify-center gap-2 mt-6 text-destructive">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">Limited slots available — price will increase after first 20 clients</span>
        </div>

        <a
          href="#form"
          className="inline-block mt-8 bg-gold-gradient text-primary-foreground font-bold px-10 py-4 rounded-lg text-lg hover:opacity-90 transition-opacity"
        >
          Claim Your Slot Now
        </a>
      </motion.div>
    </div>
  </section>
);

export default OfferSection;
