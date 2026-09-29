import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, Sparkles, Zap } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Pricing", path: "/pricing" },
  { name: "Process", path: "/process" },
  { name: "Resources", path: "/resources" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const location = useLocation();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update active index based on route location
  useEffect(() => {
    const currentIdx = navLinks.findIndex(l => l.path === location.pathname);
    if (currentIdx !== -1) {
      setActiveIdx(currentIdx);
    } else {
      setActiveIdx(-1);
    }
  }, [location.pathname]);

  // Update pill position when active changes
  useEffect(() => {
    if (activeIdx === -1) {
      setPillStyle({ left: 0, width: 0 });
      return;
    }
    const el = linkRefs.current[activeIdx];
    if (el && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setPillStyle({
        left: elRect.left - navRect.left,
        width: elRect.width,
      });
    }
  }, [activeIdx, location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
        scrolled
          ? "glassmorphism border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-gold to-purple-500 origin-left"
        style={{ scaleX }}
      />

      <div className="container max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <img src={logo} alt="Harsh AI Creations" className="w-10 h-10 md:w-12 md:h-12" />
          </motion.div>
          <div className="hidden sm:block">
            <span className="font-display font-bold text-lg md:text-xl uppercase tracking-tighter">
              Harsh AI{" "}
              <span className="shimmer-text">Creations</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav with sliding pill */}
        <div ref={navRef} className="hidden md:flex items-center gap-1 relative">
          {/* Sliding pill indicator */}
          {activeIdx !== -1 && (
            <motion.div
              className="absolute h-8 rounded-full bg-gold/10 border border-gold/20 pointer-events-none"
              animate={{ left: pillStyle.left, width: pillStyle.width }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}

          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              ref={el => { linkRefs.current[index] = el; }}
              to={link.path}
              className={`relative z-10 text-xs font-medium uppercase tracking-widest px-4 py-2 rounded-full transition-colors duration-300 ${
                activeIdx === index ? "text-gold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link to="/#form">
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="relative group overflow-hidden bg-gold-gradient text-primary-foreground text-xs font-bold px-6 py-2.5 rounded-full uppercase tracking-widest"
            >
              {/* Shine sweep */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                Get Started
              </span>
            </motion.button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <motion.button
          className="md:hidden text-foreground p-2 rounded-lg glassmorphism"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Menu className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden glassmorphism border-b border-white/5 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-bold uppercase tracking-widest py-2 px-4 rounded-xl transition-colors ${
                    activeIdx === index 
                      ? "text-gold bg-gold/10" 
                      : "text-muted-foreground hover:text-gold hover:bg-gold/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/#form"
                onClick={() => setIsOpen(false)}
                className="mt-3"
              >
                <button className="w-full bg-gold-gradient text-primary-foreground text-sm font-bold px-6 py-3.5 rounded-2xl uppercase tracking-widest flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
