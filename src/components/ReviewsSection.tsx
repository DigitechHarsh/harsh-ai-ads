import { motion } from "framer-motion";
import { Star, Quote, CheckCircle } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Malhotra",
    role: "CEO, LuxJewels",
    content: "The AI ad they created for our luxury watch line was indistinguishable from a million-dollar production. Absolutely mind-blowing quality.",
    rating: 5
  },
  {
    name: "Priya Sharma",
    role: "Founder, GlowSkin AI",
    content: "We saw a 140% increase in our click-through rate after switching to these AI visuals. The transformation from raw photo to cinematic ad is magic.",
    rating: 5
  },
  {
    name: "Vikram Singh",
    role: "Marketing Head, TechGear",
    content: "Fast, affordable, and incredibly professional. They are our go-to partner for all our product launches now.",
    rating: 5
  }
];

const ReviewsSection = () => {
  return (
    <section id="reviews" className="py-20 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px]" />
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-4"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Trusted by 25+ Global Brands</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            What Our <span className="text-gold-gradient">Clients</span> Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Join the growing list of brands dominating their market with our high-end AI visuals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-secondary/20 border border-border/50 hover:border-gold/30 transition-all duration-500 relative"
            >
              <Quote className="absolute top-6 right-8 w-12 h-12 text-gold/5 opacity-40 group-hover:text-gold/10 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>

              <p className="text-foreground/90 leading-relaxed mb-8 italic">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{t.name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Brand Logos Placeholder / Marquee */}
        <div className="mt-20 pt-10 border-t border-border/30">
           <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8">Propelling Growth For</p>
           <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
              {/* Using text as placeholder for logos if images aren't available */}
              {['ROLEX', 'PORSCHE', 'GUCCI', 'PRADA', 'DIOR', 'APPLE'].map(brand => (
                <span key={brand} className="font-display font-black text-xl md:text-2xl tracking-tighter hover:text-gold cursor-default transition-colors">{brand}</span>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
