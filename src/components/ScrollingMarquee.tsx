import { Sparkles } from "lucide-react";

const ScrollingMarquee = ({ items }: { items?: string }) => {
  const defaultItems = [
    "PREMIUM AI ADS IN 24 HOURS",
    "SCROLL-STOPPING VISUALS",
    "TRUSTED BY 25+ BRANDS",
    "SPECIAL OFFER ₹399 ONLY",
    "DOMINATE YOUR MARKET",
    "LUXURY PRODUCT TRANSFORMATION",
  ];

  const marqueeItems = items ? items.split('•').map(i => i.trim()) : defaultItems;

  // Repeat items to ensure smooth infinite loop
  const doubledItems = [...marqueeItems, ...marqueeItems];

  return (
    <div className="w-full bg-gold/10 border-y border-gold/20 py-2 overflow-hidden select-none mb-2">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {doubledItems.map((item, index) => (
          <div key={index} className="flex items-center mx-8">
            <Sparkles className="w-3.5 h-3.5 text-gold mr-3 fill-gold" />
            <span className="text-gold font-display font-bold text-[11px] md:text-[13px] uppercase tracking-[0.2em]">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingMarquee;
