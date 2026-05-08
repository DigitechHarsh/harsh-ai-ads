import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Clock, AlertCircle } from "lucide-react";

const OfferCounter = () => {
  const [stats, setStats] = useState<{ total_claimed: number; claim_limit: number } | null>(null);
  const [activeOffer, setActiveOffer] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bannersRes] = await Promise.all([
          fetch("/api/offers"),
          fetch("/api/hero")
        ]);
        const statsData = await statsRes.json();
        const bannersData = await bannersRes.json();
        
        setStats(statsData);
        if (Array.isArray(bannersData)) {
          const offer = bannersData.find((b: any) => b.is_offer);
          setActiveOffer(offer);
        }
      } catch (e) {}
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stats || !activeOffer) return null;

  const remaining = Math.max(stats.claim_limit - stats.total_claimed, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gold/10 border-b border-gold/20 py-2 flex items-center justify-center gap-4 px-4 overflow-hidden relative"
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-gold animate-pulse" />
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gold/80">
          {activeOffer.title || "LIMITED TIME OFFER"}
        </span>
      </div>
      
      <div className="h-4 w-[1px] bg-gold/30 hidden sm:block" />

      <div className="flex items-center gap-2">
        <span className="text-xs md:text-sm font-bold text-white">
          ONLY <span className="text-gold text-lg px-1">{remaining}</span> SLOTS LEFT
        </span>
      </div>

      <div className="h-4 w-[1px] bg-gold/30 hidden sm:block" />

      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gold" />
        <span className="text-[10px] md:text-xs font-bold text-white/60">
          {activeOffer.subtitle || "CLAIM NOW"}
        </span>
      </div>

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-gold/5 blur-2xl -z-10" />
    </motion.div>
  );
};

export default OfferCounter;
