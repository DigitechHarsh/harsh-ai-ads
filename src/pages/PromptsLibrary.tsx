import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Copy, CheckCircle2, Lock, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function PromptsLibrary() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: cData } = await supabase.from("prompt_campaigns").select("*");
    if (cData) setCampaigns(cData);

    const { data: pData } = await supabase.from("reel_prompts").select("*").order("created_at", { ascending: true });
    if (pData) setPrompts(pData);
    
    setLoading(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4">
        {selectedCampaign ? (
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white" onClick={() => setSelectedCampaign(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Campaigns
          </Button>
        ) : (
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
        )}
      </div>
      
      <div className="pt-10 pb-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-4 h-4 mr-2 text-primary" /> The Secret Sauce
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display uppercase tracking-wider mb-4">
            {selectedCampaign ? selectedCampaign.brand_name : "Cinematic AI Prompts"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {selectedCampaign ? `Exclusive prompts used for the ${selectedCampaign.brand_name} campaign.` : "Select a campaign to explore the exact prompts used to generate our high-end, premium commercials."}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 animate-pulse text-muted-foreground">
            Loading visual prompts...
          </div>
        ) : !selectedCampaign ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(c => (
              <div 
                key={c.brand_name} 
                className="group relative cursor-pointer rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all aspect-[4/3] bg-card"
                onClick={() => setSelectedCampaign(c)}
              >
                <img src={c.image_url} alt={c.brand_name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold font-display uppercase transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    {c.brand_name}
                  </h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-primary text-sm flex items-center">
                    Explore Prompts <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </div>
                </div>
              </div>
            ))}
            {campaigns.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-2xl">
                No campaigns published yet.
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 animate-fade-up">
            {prompts.filter(p => p.brand === selectedCampaign.brand_name).map((p) => (
              <div key={p.id} className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{p.title}</h2>
                  </div>
                  
                  {!p.is_free && (
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
                      <Lock className="w-3 h-3 mr-1" /> Premium
                    </Badge>
                  )}
                </div>

                <div className="space-y-4">
                  {p.is_free ? (
                    <>
                      {/* Image Prompt */}
                      <div className="relative">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Image Prompt</label>
                        <div className="bg-black border border-white/5 rounded-xl p-4 text-sm text-gray-300 font-mono leading-relaxed h-[180px] overflow-y-auto">
                          {p.image_prompt}
                        </div>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 backdrop-blur-md"
                          onClick={() => copyToClipboard(p.image_prompt, p.id + 'img')}
                        >
                          {copiedId === p.id + 'img' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>

                      {/* Negative Prompt */}
                      {p.negative_prompt && (
                        <div className="relative">
                          <label className="text-xs font-medium text-red-400/70 uppercase tracking-wider mb-2 block mt-4">Negative Prompt</label>
                          <div className="bg-black/50 border border-red-500/10 rounded-xl p-3 text-xs text-gray-400 font-mono leading-relaxed h-[80px] overflow-y-auto">
                            {p.negative_prompt}
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            onClick={() => copyToClipboard(p.negative_prompt, p.id + 'neg')}
                          >
                            {copiedId === p.id + 'neg' ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                          </Button>
                        </div>
                      )}

                      {/* Video Notes */}
                      {p.video_prompt && (
                        <div className="relative mt-4 pt-4 border-t border-border/50">
                          <label className="text-xs font-medium text-primary/70 uppercase tracking-wider mb-2 block">Video Generation Prompt</label>
                          <div className="bg-black border border-white/5 rounded-xl p-4 text-xs text-blue-100 font-mono leading-relaxed h-[180px] overflow-y-auto whitespace-pre-wrap">
                            {p.video_prompt}
                          </div>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 backdrop-blur-md"
                            onClick={() => copyToClipboard(p.video_prompt, p.id + 'vid')}
                          >
                            {copiedId === p.id + 'vid' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-[280px] bg-black/40 rounded-xl border border-white/5 flex flex-col items-center justify-center p-6 text-center">
                      <Lock className="w-12 h-12 text-muted-foreground/30 mb-4" />
                      <h3 className="font-bold mb-2">Premium Prompt</h3>
                      <p className="text-sm text-muted-foreground">Unlock this cinematic prompt to see the exact lighting, lensing, and rendering settings used for this shot.</p>
                      <Button className="mt-6 w-full max-w-[200px]" variant="outline">Unlock Access</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
