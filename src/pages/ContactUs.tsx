import ContactForm from "@/components/ContactForm";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin } from "lucide-react";

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
                { icon: Mail, label: "Email Us", val: "harshaicreations@gmail.com", href: "mailto:harshaicreations@gmail.com" },
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
                     {/* Add social stubs? */}
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
