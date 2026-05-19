import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SamplesSection = () => {
  const [samples, setSamples] = useState<any[]>([]);
  const [selectedSample, setSelectedSample] = useState<any | null>(null);
  const { hash } = useLocation();
  const navigate = useNavigate();

  // Determine active tab from hash
  const getActiveTab = () => {
    if (hash === "#aiimages") return "images";
    if (hash === "#aiteasers") return "teasers";
    return "videos";
  };

  const handleTabChange = (value: string) => {
    const newHash = value === "images" ? "#aiimages" : (value === "teasers" ? "#aiteasers" : "#aivideos");
    
    // If we are on the home page or portfolio page, just update hash
    if (location.pathname === "/" || location.pathname === "/portfolio") {
       navigate(newHash, { replace: true });
    } else {
       navigate(`/${newHash}`, { replace: true });
    }
    
    // Smooth scroll to the container
    setTimeout(() => {
      const element = document.getElementById("samples");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  useEffect(() => {
    if (hash === "#aivideos" || hash === "#aiimages" || hash === "#aiteasers") {
      const element = document.getElementById("samples");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash]);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const res = await fetch("/api/portfolio");
        const data = await res.json();
        if (data) setSamples(data);
      } catch (e) {}
    };
    fetchSamples();
  }, []);

  return (
    <section id="samples" className="relative py-10 md:py-16 px-4">
      <div id="aivideos" className="absolute -top-24" />
      <div id="aiimages" className="absolute -top-24" />
      <div id="aiteasers" className="absolute -top-24" />
      <div className="container">
        <motion.h2
          className="text-2xl md:text-4xl font-display font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our <span className="text-gold-gradient">Portfolio</span>
        </motion.h2>
        <p className="text-muted-foreground text-center mb-8">
          See how we transform ordinary products into premium visuals
        </p>

        <Tabs 
          value={getActiveTab()} 
          onValueChange={handleTabChange}
          className="w-full max-w-4xl mx-auto"
        >
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8 bg-secondary border border-border">
            <TabsTrigger value="videos">AI Videos</TabsTrigger>
            <TabsTrigger value="images">AI Images</TabsTrigger>
            <TabsTrigger value="teasers">Film Teasers</TabsTrigger>
          </TabsList>

          <TabsContent value="videos">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {samples.filter(s => s.media_type === "video").length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-12">No AI Videos yet.</div>
              ) : (
                samples.filter(s => s.media_type === "video").map((s, i) => (
                  <motion.div
                    key={s.id}
                    className="group relative rounded-xl overflow-hidden border border-border cursor-pointer aspect-square bg-secondary/30"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedSample(s)}
                  >
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                      <img src="/logo.png" alt="Brand Logo Watermark" className="w-10 sm:w-14 h-auto drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] opacity-90" />
                    </div>
                    <video src={s.media_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none" autoPlay muted loop playsInline controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} />
                    <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                      <Play className="w-12 h-12 text-gold mb-2" />
                      <span className="text-foreground font-medium text-center px-4">{s.title}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="images">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {samples.filter(s => s.media_type === "image").length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-12">No AI Images yet.</div>
              ) : (
                samples.filter(s => s.media_type === "image").map((s, i) => (
                  <motion.div
                    key={s.id}
                    className="group relative rounded-xl overflow-hidden border border-border cursor-pointer aspect-square bg-secondary/30"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedSample(s)}
                  >
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                      <img src="/logo.png" alt="Brand Logo Watermark" className="w-10 sm:w-14 h-auto drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] opacity-90" />
                    </div>
                    <img src={s.media_url} alt={s.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none" onContextMenu={(e) => e.preventDefault()} draggable="false" />
                    <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                      <span className="text-foreground font-medium text-center px-4">{s.title}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="teasers">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {samples.filter(s => s.media_type === "teaser").length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-12">No AI Film Teasers yet.</div>
              ) : (
                samples.filter(s => s.media_type === "teaser").map((s, i) => (
                  <motion.div
                    key={s.id}
                    className="group relative rounded-xl overflow-hidden border border-border cursor-pointer aspect-square bg-secondary/30"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedSample(s)}
                  >
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                      <img src="/logo.png" alt="Brand Logo Watermark" className="w-10 sm:w-14 h-auto drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] opacity-90" />
                    </div>
                    <video src={s.media_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none" autoPlay muted loop playsInline controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} />
                    <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                      <Play className="w-12 h-12 text-gold mb-2" />
                      <span className="text-foreground font-medium text-center px-4">{s.title}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedSample} onOpenChange={(open) => !open && setSelectedSample(null)}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-black/95 border-border">
          <DialogTitle className="sr-only">Viewing Sample</DialogTitle>
          {selectedSample && (
            <div className="w-full aspect-video flex items-center justify-center relative">
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <img src="/logo.png" alt="Brand Logo Watermark" className="w-14 sm:w-20 h-auto drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] opacity-95" />
              </div>
              {selectedSample.media_type === "video" || selectedSample.media_type === "teaser" ? (
                <video
                  src={selectedSample.media_url}
                  className="w-full h-full object-contain"
                  autoPlay
                  controls
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                />
              ) : (
                <img
                  src={selectedSample.media_url}
                  alt={selectedSample.title}
                  className="w-full h-full object-contain"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SamplesSection;
