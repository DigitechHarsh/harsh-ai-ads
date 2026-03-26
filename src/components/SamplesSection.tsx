import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const SamplesSection = () => {
  const [samples, setSamples] = useState<any[]>([]);
  const [selectedSample, setSelectedSample] = useState<any | null>(null);

  useEffect(() => {
    const fetchSamples = async () => {
      const { data } = await supabase.from("samples").select("*").order("created_at", { ascending: false });
      if (data) setSamples(data);
    };
    fetchSamples();
  }, []);

  return (
    <section id="samples" className="py-20 px-4">
      <div className="container">
        <motion.h2
          className="text-2xl md:text-4xl font-display font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our <span className="text-gold-gradient">Portfolio</span>
        </motion.h2>
        <p className="text-muted-foreground text-center mb-12">
          See how we transform ordinary products into premium visuals
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {samples.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-12">
              Portfolio is currently being updated. Come back soon!
            </div>
          ) : (
            samples.map((s, i) => (
              <motion.div
                key={s.id}
                className="group relative rounded-xl overflow-hidden border border-border cursor-pointer aspect-square bg-secondary/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedSample(s)}
              >
                {s.media_type === "video" ? (
                  <video
                    src={s.media_url}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ) : (
                  <img
                    src={s.media_url}
                    alt={s.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                  />
                )}
                <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                  <Play className="w-12 h-12 text-gold mb-2" />
                  <span className="text-foreground font-medium text-center px-4">{s.title}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <Dialog open={!!selectedSample} onOpenChange={(open) => !open && setSelectedSample(null)}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-black/95 border-border">
          <DialogTitle className="sr-only">Viewing Sample</DialogTitle>
          {selectedSample && (
            <div className="w-full aspect-video flex items-center justify-center relative">
              {selectedSample.media_type === "video" ? (
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
