import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function Resources() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/resources");
      const data = await res.json();
      if (data) setResources(data);
    } catch(e) {}
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="p-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="pt-10 pb-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <Badge variant="secondary" className="mb-4">
            <FileText className="w-4 h-4 mr-2 text-primary" /> Free Downloads
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display uppercase tracking-wider mb-4">
            Resources
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our collection of free PDFs, guides, and materials to supercharge your AI advertising campaigns.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 animate-pulse text-muted-foreground">
            Loading resources...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(r => (
              <div 
                key={r.id} 
                className="group flex flex-col justify-between bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all shadow-sm"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display uppercase mb-2 line-clamp-2">
                    {r.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Added {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <a href={r.file_url} target="_blank" rel="noreferrer" className="mt-4 block">
                  <Button variant="default" className="w-full bg-gold text-black hover:bg-gold-dark font-bold group-hover:shadow-lg transition-all">
                    <Download className="w-4 h-4 mr-2" /> View & Download
                  </Button>
                </a>
              </div>
            ))}
            {resources.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-2xl">
                No resources available yet. Check back soon!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
