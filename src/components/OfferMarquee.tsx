import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";

const OfferMarquee = () => {
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      const { data, error } = await supabase
        .from("hero_banners")
        .select("marquee_text")
        .eq("is_offer", true)
        .not("marquee_text", "is", null);

      if (!error && data) {
        setOffers(data);
      }
    };
    fetchOffers();
  }, []);

  if (offers.length === 0) return null;

  const marqueeText = offers.map((o) => o.marquee_text).join(" • ");

  return (
    <div className="w-full bg-primary/10 border-b border-primary/20 py-2.5 overflow-hidden whitespace-nowrap z-[70] relative">
      <div className="flex animate-marquee hover:pause whitespace-nowrap">
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-primary px-4">
          <Sparkles className="w-3 h-3 text-gold" />
          <span>{marqueeText}</span>
          <Sparkles className="w-3 h-3 text-gold" />
          <span>{marqueeText}</span>
          <Sparkles className="w-3 h-3 text-gold" />
          <span>{marqueeText}</span>
          <Sparkles className="w-3 h-3 text-gold" />
          <span>{marqueeText}</span>
        </div>
      </div>
    </div>
  );
};

export default OfferMarquee;
