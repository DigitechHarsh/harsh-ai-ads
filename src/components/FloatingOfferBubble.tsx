import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { X, Zap, ChevronRight, Flame } from "lucide-react";

interface BubbleConfig {
  enabled: boolean;
  text: string;
  cta: string;
}

const FloatingOfferBubble = () => {
  const [config, setConfig] = useState<BubbleConfig | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [pos, setPos] = useState({ x: 40, y: 120 });
  const [visible, setVisible] = useState(false);
  const vel = useRef({ x: 1.8, y: 1.2 });
  const posRef = useRef({ x: 40, y: 120 });
  const frameRef = useRef<number>(0);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const W = 220; // bubble width estimate
  const H = 90;  // bubble height estimate

  // Fetch config from API
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch("/api/offers");
        const data = await res.json();
        if (data.floating_bubble_enabled) {
          setConfig({
            enabled: true,
            text: data.floating_bubble_text || "🔥 Special Offer! Only ₹399",
            cta: data.floating_bubble_cta || "Grab Now",
          });
          // Show bubble after 5s delay
          setTimeout(() => setVisible(true), 5000);
        }
      } catch (e) {}
    };
    fetch_();
  }, []);

  // Bounce physics
  useEffect(() => {
    if (!visible || dismissed || !config?.enabled) return;

    const animate = () => {
      const vw = window.innerWidth - W - 20;
      const vh = window.innerHeight - H - 20;

      posRef.current.x += vel.current.x;
      posRef.current.y += vel.current.y;

      // Bounce off walls
      if (posRef.current.x <= 10 || posRef.current.x >= vw) {
        vel.current.x *= -1;
        posRef.current.x = Math.max(10, Math.min(posRef.current.x, vw));
      }
      if (posRef.current.y <= 60 || posRef.current.y >= vh) {
        vel.current.y *= -1;
        posRef.current.y = Math.max(60, Math.min(posRef.current.y, vh));
      }

      setPos({ x: posRef.current.x, y: posRef.current.y });
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [visible, dismissed, config]);

  if (!config?.enabled || dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={bubbleRef}
          initial={{ scale: 0, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0, rotate: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            zIndex: 9999,
            width: W,
            pointerEvents: "auto",
          }}
          className="bubble-3d"
        >
          {/* Glow behind */}
          <div className="absolute inset-0 bg-gold/30 blur-xl rounded-2xl" />

          {/* Main bubble card */}
          <div className="relative rounded-2xl border border-gold/40 overflow-hidden shadow-2xl"
            style={{ background: "linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(30,22,0,0.97) 100%)", backdropFilter: "blur(20px)" }}
          >
            {/* Gold top bar */}
            <div className="h-1 w-full bg-gold-gradient" />

            <div className="px-4 pt-3 pb-4 space-y-2.5">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse flex-shrink-0" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-orange-400">
                    Limited Offer
                  </span>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  className="p-0.5 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 -mt-0.5"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>

              {/* Offer text */}
              <p className="text-white text-[11px] font-bold leading-tight">
                {config.text}
              </p>

              {/* CTA */}
              <a
                href="#form"
                onClick={() => setDismissed(true)}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-gold-gradient text-black text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                <Zap className="w-3 h-3" />
                {config.cta}
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingOfferBubble;
