import { Instagram, Mail, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="border-t border-border py-12 px-4">
    <div className="container max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Harsh AI Creations" className="w-10 h-10" />
        <span className="font-display font-semibold text-lg">Harsh AI Creations</span>
      </div>
      <div className="flex items-center gap-6 text-muted-foreground">
        <a href="mailto:contact@harshaicreations.com" className="hover:text-gold transition-colors">
          <Mail className="w-5 h-5" />
        </a>
        <a href="tel:+918160587315" className="hover:text-gold transition-colors">
          <Phone className="w-5 h-5" />
        </a>
        <a href="https://www.instagram.com/harsh.ai.creations/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
          <Instagram className="w-5 h-5" />
        </a>
      </div>
    </div>
    <p className="text-center text-muted-foreground text-sm mt-8">
      © {new Date().getFullYear()} Harsh AI Creations. All rights reserved.
    </p>
  </footer>
);

export default Footer;
