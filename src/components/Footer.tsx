import { Instagram, Mail, Phone, Facebook } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="border-t border-border py-12 px-4 bg-background/50 backdrop-blur-sm">
    <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-6">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Harsh AI Creations" className="w-10 h-10 md:w-12 md:h-12" />
        <span className="font-display font-bold text-lg md:text-xl uppercase tracking-tighter">Harsh AI <span className="text-primary">Creations</span></span>
      </div>
      <div className="flex items-center gap-6 text-muted-foreground">
        <a href="mailto:aicreationsbyharsh@gmail.com" className="hover:text-primary transition-all duration-300 hover:scale-110">
          <Mail className="w-6 h-6" />
        </a>
        <a href="https://www.instagram.com/harsh.ai.creations/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all duration-300 hover:scale-110">
          <Instagram className="w-6 h-6" />
        </a>
        <a href="https://www.facebook.com/profile.php?id=61577410565855" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all duration-300 hover:scale-110">
          <Facebook className="w-6 h-6" />
        </a>
      </div>
    </div>
    <div className="container max-w-7xl mx-auto px-6 mt-8 border-t border-border/30 pt-8 text-center">
        <p className="text-muted-foreground text-xs uppercase tracking-widest">
          © {new Date().getFullYear()} Harsh AI Creations. Designed for Visual Excellence.
        </p>
    </div>
  </footer>
);

export default Footer;
