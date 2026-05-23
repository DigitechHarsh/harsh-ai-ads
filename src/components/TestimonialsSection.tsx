import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, MessageSquare, User, Building2, Send, Quote } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const testimonials = [
  { name: "Rohan Mehta", brand: "Orion Luxury Jewelry", content: "The AI visuals are mind-blowing. Our jewelry looks even more premium than the actual physical photoshoot we did last year!", rating: 5 },
  { name: "Priya Sharma", brand: "Glow & Co. Skincare", content: "24-hour delivery is real. I submitted photos on Monday and had my high-converting ad by Tuesday. Simply incredible service.", rating: 5 },
  { name: "Amit Patel", brand: "TechGadgets India", content: "Most cost-effective ad agency I've worked with. ₹399 for an image ad that looks like it cost 50k. My conversion rate tripled!", rating: 5 },
  { name: "Sarah Fernandes", brand: "Bistro Blue", content: "Our food videos now look like high-end TV commercials. The background music and cinematic movement are perfect for Reels.", rating: 5 },
  { name: "Vikram Singh", brand: "Elite Realty", content: "Needed some quick aesthetic visuals for a property launch. AI Ads delivered exactly what we needed within hours. 10/10.", rating: 5 },
  { name: "Anjali Gupta", brand: "EcoThread Apparel", content: "The way they integrated our clothing into a luxury studio environment is magical. No more expensive studio rentals!", rating: 5 },
  { name: "Deepak Rawat", brand: "FitFuel Supplements", content: "Professional, fast, and high quality. The AI-generated lighting on the bottles is hyper-realistic. Massive scroll-stopper.", rating: 5 },
  { name: "Meera Reddy", brand: "Lotus Organics", content: "Finally an agency that understands aesthetic branding. They captured our brand's vibe perfectly using just a few phone clicks.", rating: 5 },
  { name: "Rahul Khanna", brand: "Swift Auto Accessories", content: "Was skeptical about AI ads initially, but the results speak for themselves. The motion graphics are smoother than anything else.", rating: 5 },
  { name: "Sanya Kapoor", brand: "Velvet Home Decor", content: "The detail in the textures is insane. My cushions and rugs look so inviting in the AI-generated living room scenes.", rating: 5 },
  { name: "Karan Johar", brand: "Karan Sweets", content: "Best decision for my Diwali campaign. Every product look like a million bucks. Highly recommend to all small business owners.", rating: 5 },
  { name: "Neha Verma", brand: "Aura Fragrances", content: "Perfect for Instagram. The visuals are so clean and high-end. My followers actually asked where we did the shoot!", rating: 5 },
];

const AVATAR_COLORS = [
  "from-gold to-amber-500",
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-green-500 to-emerald-400",
  "from-orange-500 to-red-500",
];

const TestimonialCard = ({ item, index }: { item: typeof testimonials[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 200, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="h-full perspective-container"
    >
      <div
        className="glassmorphism rounded-3xl p-7 h-full flex flex-col group transition-all duration-500 hover:border-gold/20 relative overflow-hidden gradient-border"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

        {/* Quote icon */}
        <motion.div
          className="absolute top-6 right-6 text-gold/10 group-hover:text-gold/20 transition-colors"
          style={{ transform: "translateZ(10px)" }}
        >
          <Quote className="w-10 h-10" />
        </motion.div>

        {/* Stars — animated fill */}
        <div className="flex gap-1 mb-5" style={{ transform: "translateZ(15px)" }}>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -30, opacity: 0 }}
              whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 300 }}
            >
              <Star className="w-4 h-4 fill-gold text-gold" />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <p className="text-foreground/80 leading-relaxed mb-6 flex-grow text-sm md:text-base italic relative z-10" style={{ transform: "translateZ(8px)" }}>
          "{item.content}"
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-5" />

        {/* Author */}
        <div className="flex items-center gap-3 relative z-10" style={{ transform: "translateZ(12px)" }}>
          {/* Animated avatar */}
          <motion.div
            className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-black text-base relative flex-shrink-0`}
            whileHover={{ scale: 1.15 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ boxShadow: ["0 0 0 0 rgba(212,175,55,0)", "0 0 0 6px rgba(212,175,55,0)", "0 0 0 0 rgba(212,175,55,0)"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            {item.name[0]}
          </motion.div>
          <div>
            <h4 className="font-bold text-sm group-hover:text-gold transition-colors">{item.name}</h4>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.brand}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 3500, stopOnInteraction: false })]
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", brand: "", review: "", rating: "5" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Review Submitted!", description: "Thank you for your feedback. It has been sent for moderation." });
    setFormData({ name: "", brand: "", review: "", rating: "5" });
    setIsDialogOpen(false);
  };

  return (
    <section id="reviews" className="py-24 px-4 bg-background relative overflow-hidden">
      {/* Ambient bg */}
      <div className="absolute inset-0 aurora-bg opacity-30 pointer-events-none" />
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-500/5 blur-[200px] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="container max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism-gold text-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-5"
            >
              <Star className="w-3 h-3 fill-gold" />
              Client Love
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-display font-bold mb-4"
            >
              What Our <span className="shimmer-text">Clients</span> Say
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg"
            >
              Join 25+ brands dominating their markets with our high-end AI visuals.
            </motion.p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glassmorphism-gold border border-gold/20 px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold hover:border-gold/40 transition-all text-gold"
              >
                <MessageSquare className="w-5 h-5" />
                Write a Review
              </motion.button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background border-border">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display font-bold">
                  Submit Your <span className="shimmer-text">Review</span>
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <input required placeholder="e.g. Harsh Shah" className="w-full bg-secondary/30 border border-border rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-gold/50 transition-colors" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <input required placeholder="e.g. My Awesome Shop" className="w-full bg-secondary/30 border border-border rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-gold/50 transition-colors" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <select className="w-full bg-secondary/30 border border-border rounded-lg py-2.5 px-4 outline-none focus:border-gold/50 appearance-none" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })}>
                    <option value="5">⭐⭐⭐⭐⭐ — Amazing</option>
                    <option value="4">⭐⭐⭐⭐ — Great</option>
                    <option value="3">⭐⭐⭐ — Good</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Message</label>
                  <textarea required placeholder="Tell us about your experience..." className="w-full bg-secondary/30 border border-border rounded-lg py-3 px-4 outline-none focus:border-gold/50 h-24 resize-none transition-colors" value={formData.review} onChange={(e) => setFormData({ ...formData, review: e.target.value })} />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gold-gradient text-primary-foreground font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Review
                </motion.button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5 cursor-grab active:cursor-grabbing">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] sm:flex-[0_0_46%] lg:flex-[0_0_30%] min-w-0 perspective-container"
              >
                <TestimonialCard item={item} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent z-10" />
      </div>
    </section>
  );
};

export default TestimonialsSection;
