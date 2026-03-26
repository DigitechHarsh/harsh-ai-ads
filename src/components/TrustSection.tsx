import { motion } from "framer-motion";
import { Film, IndianRupee, Rocket } from "lucide-react";

const items = [
  { icon: Film, title: "High-Quality Cinematic Ads", desc: "Professional-grade visuals powered by AI" },
  { icon: IndianRupee, title: "Affordable Pricing", desc: "Premium quality at budget-friendly rates" },
  { icon: Rocket, title: "Fast Delivery", desc: "Get your ad within 24-48 hours" },
];

const TrustSection = () => (
  <section className="py-20 px-4">
    <div className="container max-w-4xl">
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="bg-surface-elevated border border-border rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <item.icon className="w-8 h-8 text-gold mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg mb-1">{item.title}</h3>
            <p className="text-muted-foreground text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustSection;
