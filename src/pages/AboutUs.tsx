import { motion } from "framer-motion";
import { Sparkles, Trophy, Users, ShieldCheck } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Crafting <span className="text-gold-gradient">Visual Excellence</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Harsh AI Creations is a premier cinematic agency dedicated to transforming ordinary products into high-end luxury visuals using cutting-edge AI technology.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-display font-bold text-gold-gradient">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              In a world where attention is the most valuable currency, we help brands stand out. Our mission is to democratize high-end production quality, making "million-dollar visuals" accessible to every ambitious brand owner.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We combine the precision of AI with the soul of cinematic storytelling to create ads that don't just show a product—they evoke a feeling of luxury and desire.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-square bg-secondary/30 rounded-3xl border border-gold/20 flex items-center justify-center relative overflow-hidden"
          >
             <Sparkles className="w-24 h-24 text-gold/40 animate-pulse" />
             <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full" />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
                { icon: Trophy, label: "Premium Quality", sub: "Cinema Grade" },
                { icon: Users, label: "500+ Clients", sub: "Global Reach" },
                { icon: ShieldCheck, label: "Secure Payments", sub: "Razorpay Verified" },
                { icon: Sparkles, label: "AI Powered", sub: "Next-Gen Tech" }
            ].map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-card border border-border rounded-2xl text-center hover:border-gold/30 transition-colors"
                >
                    <stat.icon className="w-8 h-8 mx-auto mb-4 text-gold" />
                    <h4 className="font-bold text-sm uppercase tracking-wider">{stat.label}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
