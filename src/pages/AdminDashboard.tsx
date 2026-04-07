import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash, LogOut, Settings2, RotateCcw, Plus, ExternalLink, Users, Zap, Layout as LayoutIcon, Sparkles, Search } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [siteStats, setSiteStats] = useState({ total_leads: 0, active_offers: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  const [samples, setSamples] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Offer Stats
  const [offerStats, setOfferStats] = useState<{ total_claimed: number; claim_limit: number } | null>(null);
  const [newLimit, setNewLimit] = useState("");

  // Banners
  const [banners, setBanners] = useState<any[]>([]);
  const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', cta_text: 'Get Started', cta_link: '#form', media_type: 'image', is_offer: false, marquee_text: '' });
  const [offerForm, setOfferForm] = useState({ title: '', subtitle: '', cta_text: 'Claim Offer', cta_link: '#form', media_type: 'image', marquee_text: '' });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [offerFile, setOfferFile] = useState<File | null>(null);

  // Prompts & Campaigns
  const [prompts, setPrompts] = useState<any[]>([]);
  const [promptForm, setPromptForm] = useState({ title: '', brand: '', image_prompt: '', negative_prompt: '', video_prompt: '', media_url: '', is_free: true });
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignBrand, setCampaignBrand] = useState("");
  const [campaignFile, setCampaignFile] = useState<File | null>(null);
  const [campaignUrl, setCampaignUrl] = useState("");
  const [promptFile, setPromptFile] = useState<File | null>(null);

  const fetchPrompts = async () => {
    const { data: pData, error: pError } = await supabase.from("reel_prompts").select("*").order("created_at", { ascending: false });
    if (!pError && pData) setPrompts(pData);
    
    const { data: cData, error: cError } = await supabase.from("prompt_campaigns").select("*");
    if (!cError && cData) setCampaigns(cData);

    const { data: bData, error: bError } = await supabase.from("hero_banners").select("*").order("priority", { ascending: true });
    if (!bError && bData) setBanners(bData);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setSession(session);
        fetchLeads();
        fetchSamples();
        fetchOfferStats();
        fetchPrompts();
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const fetchLeads = async () => {
    const { data, error } = await (supabase.from("contact_submissions" as any) as any).select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setLeads(data);
      setSiteStats(prev => ({ ...prev, total_leads: data.length }));
    }
    setLoadingLeads(false);
  };

  const fetchSamples = async () => {
    const { data, error } = await supabase.from("samples" as any).select("*").order("created_at", { ascending: false });
    if (!error && data) setSamples(data);
  };

  const fetchOfferStats = async () => {
    const { data, error } = await supabase.from("offer_tracker" as any).select("total_claimed, claim_limit").eq("id", 1).single();
    if (!error && data) {
      setOfferStats(data as any);
      setNewLimit(String((data as any).claim_limit || 20));
    }
  };

  const handleUpdateLimit = async () => {
    const limitNum = parseInt(newLimit);
    if (isNaN(limitNum) || limitNum < 1) return toast.error("Please enter a valid number");
    
    const { error } = await supabase.from("offer_tracker" as any).update({ claim_limit: limitNum }).eq("id", 1);
    if (!error) {
      toast.success("Offer limit updated!");
      fetchOfferStats();
    } else {
      toast.error("Failed to update limit");
    }
  };

  const handleResetOffer = async () => {
    const confirmed = window.confirm("Are you sure you want to reset the claimed count to 0? This starts a new campaign.");
    if (!confirmed) return;

    const { error } = await supabase.from("offer_tracker" as any).update({ total_claimed: 0 }).eq("id", 1);
    if (!error) {
      toast.success("Offer claims reset to 0!");
      fetchOfferStats();
    } else {
      toast.error("Failed to reset claims");
    }
  };

  const handleUploadSample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return toast.error("Please provide a title and file");

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from("portfolio").upload(filePath, file);
    if (uploadError) {
      toast.error(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(filePath);
    const mediaType = file.type.startsWith("video/") ? "video" : "image";

    const { error: dbError } = await (supabase.from("samples" as any) as any).insert({
      title,
      media_type: mediaType,
      media_url: publicUrl,
    });

    if (dbError) {
      toast.error(dbError.message);
    } else {
      toast.success("Sample added successfully");
      setTitle("");
      setFile(null);
      fetchSamples();
    }
    setUploading(false);
  };

  const handleDeleteSample = async (id: string, url: string) => {
    const { error } = await supabase.from("samples").delete().eq("id", id);
    if (!error) {
      toast.success("Sample deleted");
      fetchSamples();
    } else {
      toast.error(error.message);
    }
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignBrand || (!campaignFile && !campaignUrl)) return toast.error("Brand and image file OR link required");
    setUploading(true);

    let finalUrl = campaignUrl;
    if (campaignFile) {
      const fileExt = campaignFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from("portfolio").upload(filePath, campaignFile);
      if (uploadError) {
        toast.error(uploadError.message);
        setUploading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(filePath);
      finalUrl = publicUrl;
    }

    const { error: dbError } = await (supabase.from("prompt_campaigns" as any) as any).upsert({
      brand_name: campaignBrand,
      image_url: finalUrl,
    });

    if (dbError) {
      toast.error(dbError.message);
    } else {
      toast.success("Campaign Image Saved!");
      setCampaignBrand("");
      setCampaignFile(null);
      setCampaignUrl("");
      fetchPrompts();
    }
    setUploading(false);
  };

  const handleDeleteCampaign = async (brand_name: string) => {
    const { error } = await supabase.from("prompt_campaigns").delete().eq("brand_name", brand_name);
    if (!error) {
      toast.success("Campaign deleted");
      fetchPrompts();
    } else {
      toast.error(error.message);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent, type: 'regular' | 'offer' = 'regular') => {
    e.preventDefault();
    const currentForm = type === 'regular' ? bannerForm : { ...offerForm, is_offer: true };
    const currentFile = type === 'regular' ? bannerFile : offerFile;

    if (!currentFile || !currentForm.title) return toast.error("Title and Media file required");
    setUploading(true);

    const fileExt = currentFile.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `hero/${fileName}`;

    const { error: uploadError } = await supabase.storage.from("portfolio").upload(filePath, currentFile);
    if (uploadError) {
      toast.error(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(filePath);

    const { error: dbError } = await (supabase.from("hero_banners" as any) as any).insert({
      ...currentForm,
      media_url: publicUrl,
    });

    if (dbError) {
      toast.error(dbError.message);
    } else {
      toast.success(type === 'regular' ? "Hero Banner Added!" : "Offer Campaign Added!");
      if (type === 'regular') {
        setBannerForm({ title: '', subtitle: '', cta_text: 'Get Started', cta_link: '#form', media_type: 'image', is_offer: false, marquee_text: '' });
        setBannerFile(null);
      } else {
        setOfferForm({ title: '', subtitle: '', cta_text: 'Claim Offer', cta_link: '#form', media_type: 'image', marquee_text: '' });
        setOfferFile(null);
      }
      fetchPrompts();
    }
    setUploading(false);
  };

  const handleDeleteBanner = async (id: string) => {
    const { error } = await supabase.from("hero_banners" as any).delete().eq("id", id);
    if (!error) {
      toast.success("Banner deleted");
      fetchPrompts();
    } else {
      toast.error(error.message);
    }
  };

  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptForm.title || !promptForm.brand) return toast.error("Title and Brand are required");
    setUploading(true);

    let finalImageUrl = promptForm.media_url;
    if (promptFile) {
      const fileExt = promptFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `prompts/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("portfolio").upload(filePath, promptFile);
      if (uploadError) {
        toast.error(uploadError.message);
        setUploading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(filePath);
      finalImageUrl = publicUrl;
    }

    const payload = { 
      ...promptForm, 
      media_url: finalImageUrl,
      is_free: String(promptForm.is_free) === "true" || promptForm.is_free === true 
    };

    const { error } = await (supabase.from("reel_prompts" as any) as any).insert([payload]);
    if (!error) {
      toast.success("Prompt added!");
      setPromptForm({ title: '', brand: '', image_prompt: '', negative_prompt: '', video_prompt: '', media_url: '', is_free: true });
      setPromptFile(null);
      fetchPrompts();
    } else {
      toast.error(error.message);
    }
    setUploading(false);
  };

  const handleDeletePrompt = async (id: string) => {
    const { error } = await supabase.from("reel_prompts" as any).delete().eq("id", id);
    if (!error) {
      toast.success("Prompt deleted");
      fetchPrompts();
    } else {
      toast.error(error.message);
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.phone?.includes(searchTerm) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBanners = banners.filter(b => 
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.marquee_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSamples = samples.filter(s => 
    s.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrompts = prompts.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gold-gradient">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Manage your leads, offers, and library.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" size="sm" onClick={() => window.open('/', '_blank')} className="gap-2">
                <ExternalLink className="w-4 h-4" /> View Site
             </Button>
             <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" /> Logout
             </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           <Card className="bg-secondary/10 border-border/50">
              <CardContent className="pt-6">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                       <Users className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Leads</p>
                       <h3 className="text-2xl font-bold">{siteStats.total_leads}</h3>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-secondary/10 border-border/50">
              <CardContent className="pt-6">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-gold/10 text-gold rounded-xl">
                       <Zap className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Claims</p>
                       <h3 className="text-2xl font-bold">{offerStats?.total_claimed || 0} / {offerStats?.claim_limit || 20}</h3>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-secondary/10 border-border/50">
              <CardContent className="pt-6">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                       <LayoutIcon className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Banners</p>
                       <h3 className="text-2xl font-bold">{banners.length}</h3>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-secondary/10 border-border/50">
              <CardContent className="pt-6">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                       <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Prompts</p>
                       <h3 className="text-2xl font-bold">{prompts.length}</h3>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-secondary h-auto p-1 overflow-x-auto">
            <TabsTrigger value="submissions" className="py-2">Submissions</TabsTrigger>
            <TabsTrigger value="hero" className="py-2">Hero Slider</TabsTrigger>
            <TabsTrigger value="offers" className="py-2">Offers</TabsTrigger>
            <TabsTrigger value="samples" className="py-2">Portfolio</TabsTrigger>
            <TabsTrigger value="prompts" className="py-2">Prompts</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <div>
                  <CardTitle>Contact Submissions</CardTitle>
                  <CardDescription>View all leads and their offer eligibility status.</CardDescription>
                </div>
                <div className="relative w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input 
                    placeholder="Search leads..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-9 bg-secondary/50 border-none"
                   />
                </div>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                {loadingLeads ? (
                  <p>Loading leads...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Client & Product</TableHead>
                        <TableHead>Product Images</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="text-xs">{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">
                            <div className="text-sm">{lead.name}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{lead.brand_name}</div>
                            <div className="text-xs text-primary font-mono mt-1">{lead.phone}</div>
                            <div className="text-[11px] bg-secondary px-2 py-0.5 rounded inline-block mt-1">{lead.product_type}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 overflow-x-auto max-w-[200px] pb-1">
                              {lead.product_images && Array.isArray(lead.product_images) && lead.product_images.length > 0 ? (
                                (lead.product_images as string[]).map((img, idx) => (
                                  <a key={idx} href={img} target="_blank" rel="noreferrer" className="flex-shrink-0">
                                    <img src={img} alt="Product" className="w-10 h-10 rounded object-cover border border-border hover:border-primary transition-colors" />
                                  </a>
                                ))
                              ) : (
                                <span className="text-[10px] text-muted-foreground italic">No images</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {lead.is_offer_eligible ? (
                              <Badge className="bg-green-500 hover:bg-green-600 text-[10px] h-5">₹399 Offer</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px] h-5">Standard</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Add New Slide</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveBanner} className="space-y-4">
                    <Input placeholder="Banner Title" value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} />
                    <Input placeholder="Subtitle / Subtext" value={bannerForm.subtitle} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} />
                    <div className="grid grid-cols-2 gap-2">
                       <Input placeholder="CTA Text" value={bannerForm.cta_text} onChange={e => setBannerForm({...bannerForm, cta_text: e.target.value})} />
                       <Input placeholder="CTA Link" value={bannerForm.cta_link} onChange={e => setBannerForm({...bannerForm, cta_link: e.target.value})} />
                    </div>
                    <select className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm" value={bannerForm.media_type} onChange={e => setBannerForm({...bannerForm, media_type: e.target.value})}>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <Input type="file" onChange={e => setBannerFile(e.target.files?.[0] || null)} />
                    <Button type="submit" className="w-full" disabled={uploading}>{uploading ? "Uploading..." : "Publish Banner"}</Button>
                  </form>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Manage Banners</CardTitle>
                  <div className="relative w-48">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                     <Input 
                      placeholder="Search banners..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="pl-8 h-8 text-xs bg-secondary/50 border-none"
                     />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredBanners.filter(b => !b.is_offer).map(b => (
                    <div key={b.id} className="flex items-center gap-4 p-3 border rounded-lg bg-secondary/20 group">
                      <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-black">
                        {b.media_type === 'video' ? <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">VIDEO</div> : <img src={b.media_url} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm">{b.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{b.subtitle}</p>
                        <Badge variant="outline" className="mt-1 text-[10px]">{b.media_type}</Badge>
                      </div>
                      <Button variant="destructive" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => handleDeleteBanner(b.id)}><Trash className="w-4 h-4" /></Button>
                    </div>
                  ))}
                  {filteredBanners.filter(b => !b.is_offer).length === 0 && <p className="text-center py-10 text-muted-foreground text-sm">No banners found.</p>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Settings2 className="w-5 h-5 text-primary" /> Offer Campaign Settings</CardTitle>
                  <CardDescription>Manage the scarcity offer limit instantly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {offerStats && (
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>Total Offers Claimed: <span className="text-primary text-xl ml-2">{offerStats.total_claimed}</span></span>
                      <span>Offer Limit: <span className="text-xl ml-2">{offerStats.claim_limit}</span></span>
                    </div>
                  )}
                  <div className="flex gap-2 items-end pt-2">
                    <div className="space-y-1 flex-1">
                      <label className="text-xs">Update Max Claims Allowed</label>
                      <Input type="number" value={newLimit} onChange={(e) => setNewLimit(e.target.value)} />
                    </div>
                    <Button onClick={handleUpdateLimit} variant="secondary">Update Limit</Button>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <Button onClick={handleResetOffer} variant="destructive" className="w-full"><RotateCcw className="w-4 h-4 mr-2" /> Reset Claims (Start New Campaign)</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Launch New Offer</CardTitle>
                  <CardDescription>This will appear in the Marquee and Hero Slider.</CardDescription>
                </CardHeader>
                <CardContent>
                   <form onSubmit={(e) => handleSaveBanner(e, 'offer')} className="space-y-4">
                      <Input placeholder="Offer Title" value={offerForm.title} onChange={e => setOfferForm({...offerForm, title: e.target.value})} />
                      <Input placeholder="Offer Subtitle" value={offerForm.subtitle} onChange={e => setOfferForm({...offerForm, subtitle: e.target.value})} />
                      <Input placeholder="Marquee Scrolling Text (Attractive)" value={offerForm.marquee_text} onChange={e => setOfferForm({...offerForm, marquee_text: e.target.value})} />
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="CTA Text" value={offerForm.cta_text} onChange={e => setOfferForm({...offerForm, cta_text: e.target.value})} />
                        <Input placeholder="CTA Link" value={offerForm.cta_link} onChange={e => setOfferForm({...offerForm, cta_link: e.target.value})} />
                      </div>
                      <select className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm" value={offerForm.media_type} onChange={e => setOfferForm({...offerForm, media_type: e.target.value})}>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                      <Input type="file" onChange={e => setOfferFile(e.target.files?.[0] || null)} />
                      <Button type="submit" className="w-full" disabled={uploading}>{uploading ? "Launching..." : "Launch Offer"}</Button>
                   </form>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Active Offer Campaigns</CardTitle>
                <div className="relative w-48">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                   <Input 
                    placeholder="Search offers..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-8 h-8 text-xs bg-secondary/50 border-none"
                   />
                </div>
              </CardHeader>
              <CardContent>
                 <div className="grid md:grid-cols-2 gap-4">
                    {filteredBanners.filter(b => b.is_offer).map(b => (
                      <div key={b.id} className="flex items-center gap-4 p-3 border rounded-lg bg-primary/5 border-primary/20 group relative">
                        <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-black">
                          {b.media_type === 'video' ? <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">VIDEO</div> : <img src={b.media_url} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-sm text-primary">{b.title}</h4>
                          <p className="text-[10px] text-muted-foreground line-clamp-1 italic italic mb-1">"{b.marquee_text}"</p>
                          <Badge variant="outline" className="text-[10px] bg-primary/10">ACTIVE OFFER</Badge>
                        </div>
                        <Button variant="destructive" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteBanner(b.id)}><Trash className="w-4 h-4" /></Button>
                      </div>
                    ))}
                    {filteredBanners.filter(b => b.is_offer).length === 0 && <p className="text-muted-foreground text-sm py-4">No matching offer campaigns.</p>}
                 </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="samples" className="space-y-6">
             <div className="grid md:grid-cols-3 gap-6">
               <Card className="md:col-span-1 border-primary/20 bg-primary/5">
                 <CardHeader><CardTitle>Upload Portfolio</CardTitle></CardHeader>
                 <CardContent>
                    <form onSubmit={handleUploadSample} className="space-y-4">
                      <Input placeholder="Sample Title" value={title} onChange={e => setTitle(e.target.value)} />
                      <Input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
                      <Button type="submit" disabled={uploading}>{uploading ? "Saving..." : "Upload Portfolio"}</Button>
                    </form>
                 </CardContent>
               </Card>
               <Card className="md:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle>Active Portfolio</CardTitle>
                    <div className="relative w-48">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                       <Input 
                        placeholder="Search portfolio..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="pl-8 h-8 text-xs bg-secondary/50 border-none"
                       />
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                     {filteredSamples.map(s => (
                        <div key={s.id} className="relative group rounded-lg overflow-hidden border">
                           {s.media_type === 'video' ? <video src={s.media_url} className="w-full aspect-square object-cover" /> : <img src={s.media_url} className="w-full aspect-square object-cover" />}
                           <Button variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteSample(s.id, s.media_url)}><Trash className="w-4 h-4" /></Button>
                        </div>
                     ))}
                     {filteredSamples.length === 0 && <p className="col-span-3 text-center py-10 text-muted-foreground text-sm">No samples found.</p>}
                  </CardContent>
               </Card>
             </div>
          </TabsContent>

          <TabsContent value="prompts" className="space-y-8">
             <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                   <CardHeader><CardTitle>Prompts Library</CardTitle></CardHeader>
                   <CardContent>
                      <form onSubmit={handleSavePrompt} className="space-y-4">
                         <Input placeholder="Title" value={promptForm.title} onChange={e => setPromptForm({...promptForm, title: e.target.value})} />
                         <Input placeholder="Brand" value={promptForm.brand} onChange={e => setPromptForm({...promptForm, brand: e.target.value})} />
                         <div className="space-y-1">
                           <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Cover Image</label>
                           <Input type="file" onChange={e => setPromptFile(e.target.files?.[0] || null)} />
                         </div>
                         <textarea className="w-full bg-secondary p-2 rounded text-sm min-h-[100px]" placeholder="Image Prompt" value={promptForm.image_prompt} onChange={e => setPromptForm({...promptForm, image_prompt: e.target.value})} />
                         <textarea className="w-full bg-secondary p-2 rounded text-sm min-h-[100px]" placeholder="Video Prompt" value={promptForm.video_prompt} onChange={e => setPromptForm({...promptForm, video_prompt: e.target.value})} />
                         <Button type="submit" disabled={uploading}>{uploading ? "Saving..." : "Save Prompt"}</Button>
                      </form>
                   </CardContent>
                </Card>
                <Card className="md:col-span-2">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle>Existing Prompts</CardTitle>
                      <div className="relative w-48">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                         <Input 
                          placeholder="Search prompts..." 
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                          className="pl-8 h-8 text-xs bg-secondary/50 border-none"
                         />
                      </div>
                   </CardHeader>
                   <CardContent>
                      <Table>
                         <TableHeader><TableRow><TableHead>Ad / Cover</TableHead><TableHead>Brand</TableHead><TableHead>Title</TableHead><TableHead></TableHead></TableRow></TableHeader>
                         <TableBody>
                            {filteredPrompts.map(p => (
                               <TableRow key={p.id}>
                                  <TableCell>
                                     {p.media_url ? (
                                       <img src={p.media_url} className="w-12 h-12 rounded object-cover border" />
                                     ) : (
                                       <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center text-[10px] text-muted-foreground italic">No Image</div>
                                     )}
                                  </TableCell>
                                  <TableCell>{p.brand}</TableCell>
                                  <TableCell>{p.title}</TableCell>
                                  <TableCell><Button variant="ghost" size="icon" onClick={() => handleDeletePrompt(p.id)}><Trash className="w-4 h-4 text-red-500" /></Button></TableCell>
                               </TableRow>
                            ))}
                         </TableBody>
                      </Table>
                   </CardContent>
                </Card>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
