import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Play, Film, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroProduct from "@/assets/hero-product.jpg";
import afterImg from "@/assets/after.png";

export default function PortfolioShowcasePreview() {
  return (
    <section id="portfolio-preview" className="py-12 md:py-18 px-4 sm:px-6 relative overflow-hidden bg-transparent">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Visual Showcase Card */}
          <motion.div 
            className="lg:col-span-6 relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative group perspective-container">
              {/* Glowing back aura */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gold/30 via-purple-500/20 to-cyan-500/30 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Main Card Container */}
              <div className="relative rounded-3xl overflow-hidden border border-gold/30 bg-[#0d0d14]/90 backdrop-blur-xl shadow-2xl p-2 sm:p-3">
                
                {/* Main Media Showcase */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black">
                  <img 
                    src={heroProduct} 
                    alt="Cinematic AI Ads Portfolio" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Floating Play / Preview Icon */}
                  <Link 
                    to="/portfolio" 
                    className="absolute inset-0 flex items-center justify-center group/btn"
                    aria-label="View Portfolio"
                  >
                    <motion.div 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold/90 backdrop-blur-md flex items-center justify-center text-black shadow-2xl shadow-gold/50 group-hover/btn:scale-110 group-hover/btn:bg-gold transition-all duration-300"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-black translate-x-0.5" />
                    </motion.div>
                  </Link>

                  {/* Badge top left */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/75 backdrop-blur-md text-gold border border-gold/40 text-xs font-bold px-3 py-1 uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                      <Film className="w-3.5 h-3.5" /> Featured Work
                    </Badge>
                  </div>

                  {/* Info bottom row inside image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gold font-bold uppercase tracking-widest">Commercial Showcase</p>
                      <h4 className="text-lg sm:text-xl font-bold text-white font-display">4K Cinematic AI Video Ads</h4>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-bold text-neutral-300">
                      <Award className="w-4 h-4 text-gold" /> Studio Quality
                    </div>
                  </div>
                </div>

                {/* Sub-preview thumbnail stack */}
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/5">
                  <div className="relative rounded-xl overflow-hidden aspect-[16/10] border border-white/10 bg-black/50">
                    <img src={afterImg} alt="Preview 1" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white bg-black/60 px-1 rounded">3D CGI</span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden aspect-[16/10] border border-white/10 bg-black/50">
                    <img src={heroProduct} alt="Preview 2" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white bg-black/60 px-1 rounded">AI Videos</span>
                  </div>
                  <Link to="/portfolio" className="relative rounded-xl overflow-hidden aspect-[16/10] border border-gold/30 bg-gold/10 hover:bg-gold/20 flex flex-col items-center justify-center text-center transition-colors">
                    <span className="text-xs font-black text-gold uppercase">+ View All</span>
                    <span className="text-[9px] text-muted-foreground">Portfolio</span>
                  </Link>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Right: Description & Action */}
          <motion.div 
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div>
              <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30 text-xs font-bold uppercase tracking-wider px-3.5 py-1 mb-3">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-gold inline" />
                Our Portfolio
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight">
                Transforming Products Into <span className="text-gold-gradient">Cinematic Masterpieces</span>
              </h2>
            </div>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Explore our full collection of hyper-realistic 4K AI video ads, 3D CGI product commercials, and high-converting visual campaigns created for luxury brands, e-commerce, and agencies worldwide.
            </p>

            {/* Feature Points */}
            <div className="space-y-3 pt-2">
              {[
                { title: "Ultra High-Definition 4K Renders", desc: "Photorealistic lighting, fluid physics, and studio camera motion." },
                { title: "Engineered for 3x Higher ROAS", desc: "Hook viewers in the first 2 seconds with high-engagement storytelling." },
                { title: "Multi-Platform Ready", desc: "Optimized for Instagram Reels, Meta Ads, YouTube Shorts, and TikTok." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-gold/30 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button linking to /portfolio */}
            <div className="pt-2">
              <Link to="/portfolio">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gold-gradient text-black font-extrabold text-sm sm:text-base px-8 py-6 rounded-2xl shadow-xl shadow-gold/20 hover:opacity-95 active:scale-95 transition-all group"
                >
                  <span>Explore Full Portfolio</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
