import { Sparkles } from "lucide-react";

const ScrollingMarquee = () => {
  const items = [
    "PREMIUM AI ADS IN 24 HOURS",
    "SCROLL-STOPPING VISUALS",
    "TRUSTED BY 500+ BRANDS",
    "SPECIAL OFFER ₹399 ONLY",
    "DOMINATE YOUR MARKET",
    "LUXURY PRODUCT TRANSFORMATION",
  ];

  // Repeat items to ensure smooth infinite loop
  const doubledItems = [...items, ...items];

  return (
    <div className="w-full bg-gold/10 border-y border-gold/20 py-3 overflow-hidden select-none mb-10">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {doubledItems.map((item, index) => (
          <div key={index} className="flex items-center mx-8">
            <Sparkles className="w-4 h-4 text-gold mr-3 fill-gold" />
            <span className="text-gold font-display font-bold text-xs md:text-sm uppercase tracking-[0.2em]">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingMarquee;
