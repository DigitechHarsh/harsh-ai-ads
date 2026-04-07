import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Users } from "lucide-react";

const OfferCountdownBar = () => {
  const [stats, setStats] = useState<{ total_claimed: number; claim_limit: number } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("offer_tracker" as any)
        .select("total_claimed, claim_limit")
        .eq("id", 1)
        .single();
      
      if (!error && data) {
        setStats(data as any);
      }
    };
    fetchStats();

    // Real-time updates
    const channel = supabase
      .channel("offer_changes")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "offer_tracker" }, (payload) => {
        setStats(payload.new as any);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!stats) return null;

  const spotsLeft = Math.max(0, stats.claim_limit - stats.total_claimed);

  return (
    <AnimatePresence>
      {spotsLeft > 0 && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="w-full bg-gold-gradient py-2 px-4 shadow-lg z-[65] relative"
        >
          <div className="container max-w-7xl mx-auto flex items-center justify-center gap-4 text-primary-foreground font-bold text-[10px] sm:text-xs uppercase tracking-widest">
            <Zap className="w-4 h-4 fill-current animate-pulse" />
            <span className="text-center">
              FLASH OFFER: ONLY <span className="underline decoration-2 underline-offset-4">{spotsLeft} SPOTS LEFT</span> FOR THE ₹399/- CINEMATIC AD
            </span>
            <div className="hidden md:flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full">
               <Users className="w-3 h-3" />
               <span>{stats.total_claimed} Claimed</span>
            </div>
            <Zap className="w-4 h-4 fill-current animate-pulse" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfferCountdownBar;
