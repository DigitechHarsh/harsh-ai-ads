import ContactForm from "@/components/ContactForm";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Instagram, Facebook } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 italic leading-tight">
                Let's Build Your <span className="text-gold-gradient">Next Masterpiece</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Have a product that needs a high-end visual makeover? Or a custom agency project in mind? Our team is ready to help you dominate your market.
              </p>
            </div>

            <div className="grid gap-6">
              {[
                { icon: Mail, label: "Email Us", val: "aicreationsbyharsh@gmail.com", href: "mailto:aicreationsbyharsh@gmail.com" },
                { icon: MessageCircle, label: "WhatsApp", val: "+91 81605 87315", href: "https://wa.me/918160587315" },
                { icon: MapPin, label: "Location", val: "Gujarat, India", href: "#" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50 group hover:border-gold/30 transition-all duration-300">
                  <div className="p-3 rounded-lg bg-gold/10 text-gold group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                    <a href={item.href} className="text-foreground transition-colors font-semibold hover:text-gold">{item.val}</a>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links or additional context? */}
            <div className="pt-6">
                 <p className="text-sm font-medium text-muted-foreground mb-4">Follow us for updates: </p>
                  <div className="flex gap-4">
                     <a href="https://www.instagram.com/harsh.ai.creations/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-secondary/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300">
                        <Instagram className="w-5 h-5" />
                     </a>
                     <a href="https://www.facebook.com/profile.php?id=61577410565855" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-secondary/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300">
                        <Facebook className="w-5 h-5" />
                     </a>
                  </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
