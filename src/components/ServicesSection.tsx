import { motion } from "framer-motion";
import { Video, Camera, Sparkles, Monitor, Layers, Film } from "lucide-react";

const services = [
  {
    title: "AI Video Ads",
    icon: <Video className="w-8 h-8 text-gold" />,
    description: "High-impact video content designed to stop the scroll and drive action.",
    categories: [
      { name: "CGI AI Ads", desc: "Hyper-realistic product renders in surreal environments.", icon: <Layers className="w-4 h-4" /> },
      { name: "UGC AI Ads", desc: "Relatable, human-centric content with an AI edge.", icon: <Monitor className="w-4 h-4" /> },
      { name: "Cinematic Ads", desc: "Premium story-driven production quality.", icon: <Film className="w-4 h-4" /> }
    ],
    highlight: "4K ULTRA HD"
  },
  {
    title: "AI Image Ads",
    icon: <Camera className="w-8 h-8 text-gold" />,
    description: "Studio-quality product photography that looks like it cost thousands.",
    categories: [
      { name: "Studio Renders", desc: "Clean, professional product shots.", icon: <Sparkles className="w-4 h-4" /> },
      { name: "Lifestyle Scenes", desc: "Products integrated into high-end life scenes.", icon: <Sparkles className="w-4 h-4" /> },
      { name: "Creative Art", desc: "Conceptual visuals that push brand boundaries.", icon: <Sparkles className="w-4 h-4" /> }
    ],
    highlight: "4K HIGH RES"
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-background relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gold/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
          >
            What we deliver
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            Our AI <span className="text-gold-gradient">Expertise</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We specialize in creating high-resolution visuals that redefine how brands communicate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group p-8 md:p-12 rounded-[2rem] bg-secondary/10 border border-border/50 hover:border-gold/30 transition-all duration-500 relative"
            >
              {/* 4K Badge */}
              <div className="absolute top-8 right-8 bg-gold text-black text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                {service.highlight}
              </div>

              <div className="mb-8 p-4 bg-gold/10 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500">
                {service.icon}
              </div>

              <h3 className="text-3xl font-display font-bold mb-4">{service.title}</h3>
              <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                {service.description}
              </p>

              <div className="grid gap-4">
                {service.categories.map((cat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-background/40 border border-border/30 hover:bg-gold/5 transition-colors"
                  >
                    <div className="p-2 bg-gold/10 text-gold rounded-lg mt-1">
                      {cat.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{cat.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{cat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quality Assurance Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-3xl bg-gold-gradient text-black flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <Monitor className="w-10 h-10" />
            <div>
              <h4 className="font-black text-xl uppercase tracking-tight">4K Ultra-High Resolution</h4>
              <p className="text-black/70 font-medium">Standard for all image and video deliveries.</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => <div key={i} className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
