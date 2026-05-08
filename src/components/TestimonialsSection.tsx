import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, User, Building2, Send } from "lucide-react";
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
  {
    name: "Rohan Mehta",
    brand: "Orion Luxury Jewelry",
    content: "The AI visuals are mind-blowing. Our jewelry looks even more premium than the actual physical photoshoot we did last year!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    brand: "Glow & Co. Skincare",
    content: "24-hour delivery is real. I submitted photos on Monday and had my high-converting ad by Tuesday. Simply incredible service.",
    rating: 5,
  },
  {
    name: "Amit Patel",
    brand: "TechGadgets India",
    content: "Most cost-effective ad agency I've worked with. ₹399 for an image ad that looks like it cost 50k. My conversion rate tripled!",
    rating: 5,
  },
  {
    name: "Sarah Fernandes",
    brand: "Bistro Blue",
    content: "Our food videos now look like high-end TV commercials. The background music and cinematic movement are perfect for Reels.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    brand: "Elite Realty",
    content: "Needed some quick aesthetic visuals for a property launch. AI Ads delivered exactly what we needed within hours. 10/10.",
    rating: 5,
  },
  {
    name: "Anjali Gupta",
    brand: "EcoThread Apparel",
    content: "The way they integrated our clothing into a luxury studio environment is magical. No more expensive studio rentals!",
    rating: 5,
  },
  {
    name: "Deepak Rawat",
    brand: "FitFuel Supplements",
    content: "Professional, fast, and high quality. The AI-generated lighting on the bottles is hyper-realistic. Massive scroll-stopper.",
    rating: 5,
  },
  {
    name: "Meera Reddy",
    brand: "Lotus Organics",
    content: "Finally an agency that understands aesthetic branding. They captured our brand's vibe perfectly using just a few phone clicks.",
    rating: 5,
  },
  {
    name: "Rahul Khanna",
    brand: "Swift Auto Accessories",
    content: "Was skeptical about AI ads initially, but the results speak for themselves. The motion graphics are smoother than anything else.",
    rating: 5,
  },
  {
    name: "Sanya Kapoor",
    brand: "Velvet Home Decor",
    content: "The detail in the textures is insane. My cushions and rugs look so inviting in the AI-generated living room scenes.",
    rating: 5,
  },
  {
    name: "Karan Johar (Local Merchant)",
    brand: "Karan Sweets",
    content: "Best decision for my Diwali campaign. Every product look like a million bucks. Highly recommend to all small business owners.",
    rating: 5,
  },
  {
    name: "Neha Verma",
    brand: "Aura Fragrances",
    content: "Perfect for Instagram. The visuals are so clean and high-end. My followers actually asked where we did the shoot!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [Autoplay({ delay: 3000 })]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", brand: "", review: "", rating: "5" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback. It has been sent for moderation.",
    });
    setFormData({ name: "", brand: "", review: "", rating: "5" });
    setIsDialogOpen(false);
  };

  return (
    <section id="reviews" className="py-20 px-4 bg-background relative overflow-hidden">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-5xl font-display font-bold mb-4"
            >
              What Our <span className="text-gold-gradient">Clients</span> Say
            </motion.h2>
            <p className="text-muted-foreground text-lg">
              Join 25+ brands that are dominating their markets with our high-end AI visuals.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary/50 border border-border px-6 py-3 rounded-xl flex items-center gap-2 font-semibold hover:bg-secondary transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-gold" />
                Write a Review
              </motion.button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background border-border">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display font-bold">Submit Your <span className="text-gold-gradient">Review</span></DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <input
                      required
                      placeholder="e.g. Harsh Shah"
                      className="w-full bg-secondary/30 border border-border rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-gold/50"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <input
                      required
                      placeholder="e.g. My Awesome Shop"
                      className="w-full bg-secondary/30 border border-border rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-gold/50"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <select
                    className="w-full bg-secondary/30 border border-border rounded-lg py-2.5 px-4 outline-none focus:border-gold/50 appearance-none"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  >
                    <option value="5">5 Stars - Amazing</option>
                    <option value="4">4 Stars - Great</option>
                    <option value="3">3 Stars - Good</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Message</label>
                  <textarea
                    required
                    placeholder="Tell us about your experience..."
                    className="w-full bg-secondary/30 border border-border rounded-lg py-3 px-4 outline-none focus:border-gold/50 h-24 resize-none"
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold-gradient text-primary-foreground font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Review
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((item, index) => (
              <div 
                key={index} 
                className="flex-[0_0_100%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0"
              >
                <div className="bg-secondary/20 border border-border/50 p-8 rounded-3xl h-full flex flex-col hover:border-gold/30 transition-all duration-300 group">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  
                  <p className="text-foreground leading-relaxed mb-8 flex-grow italic">
                    "{item.content}"
                  </p>

                  <div className="flex items-center gap-4 border-t border-border/50 pt-6">
                    <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {item.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold group-hover:text-gold transition-colors">{item.name}</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">{item.brand}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-12 opacity-40 grayscale pointer-events-none">
          {["E-commerce", "Real Estate", "Beauty", "Food", "Fashion", "Electronics"].map((cat) => (
            <span key={cat} className="text-sm font-bold uppercase tracking-[0.3em]">{cat}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
