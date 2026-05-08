import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  // Editing States
  const [editingSampleId, setEditingSampleId] = useState<string | null>(null);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const authFetch = async (url: string, options: any = {}) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token");
    const headers = { ...options.headers, Authorization: `Bearer ${token}` };
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const uploadToCloudinary = async (file: File) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) throw new Error("Cloudinary credentials missing");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const fetchPrompts = async () => {
    try {
      setPrompts(await fetch("/api/prompts").then(r => r.json()));
      setCampaigns(await fetch("/api/campaigns").then(r => r.json()));
      setBanners(await fetch("/api/hero").then(r => r.json()));
    } catch(e) {}
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setSession({ token });
      fetchLeads();
      fetchSamples();
      fetchOfferStats();
      fetchPrompts();
    }
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchLeads = async () => {
    try {
      const data = await authFetch("/api/leads");
      setLeads(data);
      setSiteStats(prev => ({ ...prev, total_leads: data.length }));
    } catch(e) {}
    setLoadingLeads(false);
  };

  const fetchSamples = async () => {
    try {
      setSamples(await fetch("/api/portfolio").then(r => r.json()));
    } catch(e) {}
  };

  const fetchOfferStats = async () => {
    try {
      const data = await fetch("/api/offers").then(r => r.json());
      setOfferStats(data);
      setNewLimit(String(data.claim_limit || 20));
    } catch(e) {}
  };

  const handleUpdateLimit = async () => {
    const limitNum = parseInt(newLimit);
    if (isNaN(limitNum) || limitNum < 1) return toast.error("Please enter a valid number");
    
    try {
      await authFetch("/api/offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim_limit: limitNum })
      });
      toast.success("Offer limit updated!");
      fetchOfferStats();
    } catch(e) {
      toast.error("Failed to update limit");
    }
  };

  const handleResetOffer = async () => {
    const confirmed = window.confirm("Are you sure you want to reset the claimed count to 0? This starts a new campaign.");
    if (!confirmed) return;

    try {
      await authFetch("/api/offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total_claimed: 0 })
      });
      toast.success("Offer claims reset to 0!");
      fetchOfferStats();
    } catch(e) {
      toast.error("Failed to reset claims");
    }
  };

  const handleUploadSample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return toast.error("Please provide a title");
    if (!file && !editingSampleId) return toast.error("Please provide a file");

    setUploading(true);
    try {
      let publicUrl = undefined;
      let mediaType = undefined;

      if (file) {
        publicUrl = await uploadToCloudinary(file);
        mediaType = file.type.startsWith("video/") ? "video" : "image";
      }

      const payload: any = { title };
      if (publicUrl) payload.media_url = publicUrl;
      if (mediaType) payload.media_type = mediaType;

      const url = editingSampleId ? `/api/portfolio?id=${editingSampleId}` : "/api/portfolio";
      const method = editingSampleId ? "PUT" : "POST";

      await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      toast.success(editingSampleId ? "Sample updated successfully" : "Sample added successfully");
      setTitle("");
      setFile(null);
      setEditingSampleId(null);
      fetchSamples();
    } catch(e: any) {
      toast.error(e.message);
    }
    setUploading(false);
  };

  const handleEditSample = (sample: any) => {
    setEditingSampleId(sample.id);
    setTitle(sample.title);
    setFile(null); // Requires re-uploading file if they want to change it
    toast.info("Editing Sample. Enter new details above.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteSample = async (id: string, url: string) => {
    try {
      await authFetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
      toast.success("Sample deleted");
      fetchSamples();
    } catch(e: any) {
      toast.error(e.message);
    }
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignBrand) return toast.error("Brand name required");
    if (!campaignFile && !campaignUrl && !editingCampaignId) return toast.error("Image file OR link required");
    
    setUploading(true);

    let finalUrl = campaignUrl;
    try {
      if (campaignFile) {
        finalUrl = await uploadToCloudinary(campaignFile);
      }

      const payload: any = { brand_name: campaignBrand };
      if (finalUrl) payload.image_url = finalUrl;

      const url = editingCampaignId ? `/api/campaigns?id=${editingCampaignId}` : "/api/campaigns";
      const method = editingCampaignId ? "PUT" : "POST";

      await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      toast.success(editingCampaignId ? "Campaign Updated!" : "Campaign Image Saved!");
      setCampaignBrand("");
      setCampaignFile(null);
      setCampaignUrl("");
      setEditingCampaignId(null);
      fetchPrompts();
    } catch(e: any) {
      toast.error(e.message);
    }
    setUploading(false);
  };

  const handleEditCampaign = (campaign: any) => {
    setEditingCampaignId(campaign.id);
    setCampaignBrand(campaign.brand_name);
    setCampaignUrl(campaign.image_url);
    setCampaignFile(null);
    toast.info("Editing Campaign. Enter new details above.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      await authFetch(`/api/campaigns?id=${id}`, { method: "DELETE" });
      toast.success("Campaign deleted");
      fetchPrompts();
    } catch(e: any) {
      toast.error(e.message);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent, type: 'regular' | 'offer' = 'regular') => {
    e.preventDefault();
    const currentForm = type === 'regular' ? bannerForm : { ...offerForm, is_offer: true };
    const currentFile = type === 'regular' ? bannerFile : offerFile;
    const editingId = type === 'regular' ? editingBannerId : editingOfferId;

    if (!currentForm.title) return toast.error("Title required");
    if (!currentFile && !editingId) return toast.error("Media file required");
    
    setUploading(true);

    try {
      let publicUrl = undefined;
      if (currentFile) {
        publicUrl = await uploadToCloudinary(currentFile);
      }

      const payload: any = { ...currentForm };
      if (publicUrl) payload.media_url = publicUrl;

      const url = editingId ? `/api/hero?id=${editingId}` : "/api/hero";
      const method = editingId ? "PUT" : "POST";

      await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      toast.success(editingId ? "Updated Successfully!" : (type === 'regular' ? "Hero Banner Added!" : "Offer Campaign Added!"));
      
      if (type === 'regular') {
        setBannerForm({ title: '', subtitle: '', cta_text: 'Get Started', cta_link: '#form', media_type: 'image', is_offer: false, marquee_text: '' });
        setBannerFile(null);
        setEditingBannerId(null);
      } else {
        setOfferForm({ title: '', subtitle: '', cta_text: 'Claim Offer', cta_link: '#form', media_type: 'image', marquee_text: '' });
        setOfferFile(null);
        setEditingOfferId(null);
      }
      fetchPrompts();
    } catch(e: any) {
      toast.error(e.message);
    }
    setUploading(false);
  };

  const handleEditBanner = (banner: any, type: 'regular' | 'offer' = 'regular') => {
    if (type === 'regular') {
      setEditingBannerId(banner.id);
      setBannerForm({ title: banner.title, subtitle: banner.subtitle, cta_text: banner.cta_text, cta_link: banner.cta_link, media_type: banner.media_type, is_offer: false, marquee_text: banner.marquee_text || '' });
      setBannerFile(null);
    } else {
      setEditingOfferId(banner.id);
      setOfferForm({ title: banner.title, subtitle: banner.subtitle, cta_text: banner.cta_text, cta_link: banner.cta_link, media_type: banner.media_type, marquee_text: banner.marquee_text || '' });
      setOfferFile(null);
    }
    toast.info("Editing Banner. Enter new details above.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      await authFetch(`/api/hero?id=${id}`, { method: "DELETE" });
      toast.success("Banner deleted");
      fetchPrompts();
    } catch(e: any) {
      toast.error(e.message);
    }
  };

  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptForm.title || !promptForm.brand) return toast.error("Title and Brand are required");
    setUploading(true);

    let finalImageUrl = promptForm.media_url;
    try {
      if (promptFile) {
        finalImageUrl = await uploadToCloudinary(promptFile);
      }

      const payload = { 
        ...promptForm, 
        media_url: finalImageUrl,
        is_free: String(promptForm.is_free) === "true" || promptForm.is_free === true 
      };

      const url = editingPromptId ? `/api/prompts?id=${editingPromptId}` : "/api/prompts";
      const method = editingPromptId ? "PUT" : "POST";

      await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      toast.success(editingPromptId ? "Prompt updated!" : "Prompt added!");
      setPromptForm({ title: '', brand: '', image_prompt: '', negative_prompt: '', video_prompt: '', media_url: '', is_free: true });
      setPromptFile(null);
      setEditingPromptId(null);
      fetchPrompts();
    } catch(e: any) {
      toast.error(e.message);
    }
    setUploading(false);
  };

  const handleEditPrompt = (prompt: any) => {
    setEditingPromptId(prompt.id);
    setPromptForm({ 
      title: prompt.title, 
      brand: prompt.brand, 
      image_prompt: prompt.image_prompt, 
      negative_prompt: prompt.negative_prompt || '', 
      video_prompt: prompt.video_prompt || '', 
      media_url: prompt.media_url, 
      is_free: prompt.is_free 
    });
    setPromptFile(null);
    toast.info("Editing Prompt. Enter new details above.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePrompt = async (id: string) => {
    try {
      await authFetch(`/api/prompts?id=${id}`, { method: "DELETE" });
      toast.success("Prompt deleted");
      fetchPrompts();
    } catch(e: any) {
      toast.error(e.message);
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
          <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <TabsList className="flex flex-col w-full bg-secondary/30 h-auto p-2 gap-1 border border-border/50 rounded-2xl">
              <TabsTrigger 
                value="submissions" 
                className="w-full justify-start gap-3 py-3 px-4 data-[state=active]:bg-gold/10 data-[state=active]:text-gold transition-all"
              >
                <Users className="w-4 h-4" /> Submissions
              </TabsTrigger>
              <TabsTrigger 
                value="hero" 
                className="w-full justify-start gap-3 py-3 px-4 data-[state=active]:bg-gold/10 data-[state=active]:text-gold transition-all"
              >
                <Zap className="w-4 h-4" /> Offers & Banners
              </TabsTrigger>
              <TabsTrigger 
                value="samples" 
                className="w-full justify-start gap-3 py-3 px-4 data-[state=active]:bg-gold/10 data-[state=active]:text-gold transition-all"
              >
                <LayoutIcon className="w-4 h-4" /> Portfolio
              </TabsTrigger>
              <TabsTrigger 
                value="prompts" 
                className="w-full justify-start gap-3 py-3 px-4 data-[state=active]:bg-gold/10 data-[state=active]:text-gold transition-all"
              >
                <Sparkles className="w-4 h-4" /> Prompts
              </TabsTrigger>
            </TabsList>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow min-w-0">
            <TabsContent value="submissions" className="mt-0">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                  <div>
                    <CardTitle className="text-2xl font-display font-bold">Contact Submissions</CardTitle>
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
                <CardContent className="max-h-[700px] overflow-y-auto">
                  {loadingLeads ? (
                    <div className="text-center py-20">
                       <RotateCcw className="w-8 h-8 animate-spin mx-auto text-muted-foreground mb-4" />
                       <p className="text-muted-foreground">Loading leads...</p>
                    </div>
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
                          <TableRow key={lead.id} className="hover:bg-secondary/20 transition-colors">
                            <TableCell className="text-xs">{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="font-medium">
                              <div className="text-sm font-bold">{lead.name}</div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{lead.brand_name}</div>
                              <div className="text-xs text-gold font-mono mt-1">{lead.phone}</div>
                              <div className="text-[11px] bg-secondary px-2 py-0.5 rounded inline-block mt-1">{lead.product_type}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1 overflow-x-auto max-w-[200px] pb-1">
                                {lead.product_images && Array.isArray(lead.product_images) && lead.product_images.length > 0 ? (
                                  (lead.product_images as string[]).map((img, idx) => (
                                    <a key={idx} href={img} target="_blank" rel="noreferrer" className="flex-shrink-0 group">
                                      <img src={img} alt="Product" className="w-12 h-12 rounded-lg object-cover border border-border group-hover:border-gold transition-all" />
                                    </a>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-muted-foreground italic">No images</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {lead.is_offer_eligible ? (
                                <Badge className="bg-gold/20 text-gold hover:bg-gold/30 border-gold/30 text-[10px] h-5">₹399 Offer</Badge>
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

            <TabsContent value="hero" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Card className="border-border/50 shadow-sm overflow-hidden">
                  <CardHeader className="flex flex-col sm:flex-row items-center justify-between bg-secondary/10 pb-6 border-b border-border/30 gap-4">
                    <div>
                      <CardTitle className="text-xl font-display font-bold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-gold" /> Offers & Hero Banners
                      </CardTitle>
                      <CardDescription>Manage your landing page offers and scarcity limits.</CardDescription>
                    </div>
                    
                    {/* Integrated Scarcity Controls */}
                    <div className="flex items-center gap-3 bg-background/50 p-2 rounded-xl border border-border/50">
                       <div className="flex flex-col px-2">
                          <span className="text-[8px] font-bold uppercase text-muted-foreground">Slots Left</span>
                          <span className="text-sm font-bold text-gold">
                            {offerStats ? Math.max(offerStats.claim_limit - offerStats.total_claimed, 0) : '0'} / {offerStats?.claim_limit || '0'}
                          </span>
                       </div>
                       <div className="w-[1px] h-8 bg-border/50" />
                       <div className="flex flex-col px-2">
                          <span className="text-[8px] font-bold uppercase text-muted-foreground">Total Claimed</span>
                          <span className="text-sm font-bold">{offerStats?.total_claimed || 0}</span>
                       </div>
                       <div className="flex gap-1 ml-2">
                          <Input 
                            type="number" 
                            value={newLimit} 
                            onChange={(e) => setNewLimit(e.target.value)} 
                            className="w-16 h-8 text-xs bg-background" 
                            placeholder="Limit"
                          />
                          <Button size="icon" className="h-8 w-8" onClick={handleUpdateLimit} title="Update Limit">
                            <Settings2 className="w-3 h-3" />
                          </Button>
                          <Button size="icon" variant="destructive" className="h-8 w-8" onClick={handleResetOffer} title="Reset Claims">
                            <RotateCcw className="w-3 h-3" />
                          </Button>
                       </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
                    {/* Add Form */}
                    <div className="lg:col-span-4 space-y-4 bg-secondary/20 p-6 rounded-2xl border border-border/50 h-fit">
                      <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">
                        {editingBannerId ? "Edit Banner" : "Add New Banner"}
                      </h4>
                      <form onSubmit={handleSaveBanner} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Main Title (Display on Counter)</label>
                          <Input placeholder="e.g. SPECIAL OFFER" value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} className="bg-background" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Subtitle (Counter Subtext)</label>
                          <Input placeholder="e.g. ₹399 ONLY" value={bannerForm.subtitle} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} className="bg-background" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">CTA Text</label>
                             <Input placeholder="Get Started" value={bannerForm.cta_text} onChange={e => setBannerForm({...bannerForm, cta_text: e.target.value})} className="bg-background" />
                           </div>
                           <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">CTA Link</label>
                             <Input placeholder="#form" value={bannerForm.cta_link} onChange={e => setBannerForm({...bannerForm, cta_link: e.target.value})} className="bg-background" />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Media Type</label>
                            <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={bannerForm.media_type} onChange={e => setBannerForm({...bannerForm, media_type: e.target.value})}>
                              <option value="image">Image</option>
                              <option value="video">Video</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2 pt-6">
                             <input type="checkbox" id="is_offer" checked={bannerForm.is_offer} onChange={e => setBannerForm({...bannerForm, is_offer: e.target.checked})} className="w-4 h-4 rounded border-border" />
                             <label htmlFor="is_offer" className="text-[10px] cursor-pointer select-none font-bold uppercase">Activate Scarcity</label>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Marquee Text (• separate)</label>
                          <textarea 
                            placeholder="PREMIUM • FAST • AI" 
                            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm min-h-[60px]" 
                            value={bannerForm.marquee_text} 
                            onChange={e => setBannerForm({...bannerForm, marquee_text: e.target.value})} 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Upload Media</label>
                          <Input type="file" onChange={e => setBannerFile(e.target.files?.[0] || null)} className="bg-background" />
                        </div>
                        <Button type="submit" className="w-full h-11 bg-gold hover:bg-gold-dark text-black font-bold" disabled={uploading}>
                          {uploading ? "Saving..." : (editingBannerId ? "Update Banner" : "Publish Banner")}
                        </Button>
                        {editingBannerId && (
                          <Button variant="ghost" className="w-full text-xs" onClick={() => {
                            setEditingBannerId(null);
                            setBannerForm({ title: '', subtitle: '', cta_text: 'Get Started', cta_link: '#form', media_type: 'image', is_offer: false, marquee_text: '' });
                          }}>Cancel Editing</Button>
                        )}
                      </form>
                    </div>

                    {/* List */}
                    <div className="lg:col-span-8 space-y-4">
                       <div className="flex items-center justify-between mb-2 px-1">
                         <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Active Banners & Offers</h4>
                         <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                            <Input 
                             placeholder="Search banners..." 
                             value={searchTerm} 
                             onChange={(e) => setSearchTerm(e.target.value)} 
                             className="pl-8 h-8 text-xs bg-secondary/50 border-border/50"
                            />
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                          {filteredBanners.map(b => (
                            <div key={b.id} className={`flex flex-col p-4 border rounded-2xl group transition-all hover:shadow-lg relative overflow-hidden ${b.is_offer ? 'bg-gold/5 border-gold/30 shadow-gold/5' : 'bg-background border-border/50'}`}>
                              {b.is_offer && (
                                <div className="absolute top-0 right-0">
                                   <div className="bg-gold text-black text-[8px] font-bold px-3 py-1 rounded-bl-xl uppercase">Tracking Scarcity</div>
                                </div>
                              )}
                              
                              <div className="flex gap-4">
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-black border border-border/50 shadow-inner">
                                  {b.media_type === 'video' ? (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                       <Zap className="w-6 h-6 text-gold/50" />
                                    </div>
                                  ) : (
                                    <img src={b.media_url} className="w-full h-full object-cover" />
                                  )}
                                </div>
                                <div className="flex-grow min-w-0">
                                  <h4 className={`font-bold text-base leading-tight truncate ${b.is_offer ? 'text-gold' : ''}`}>{b.title}</h4>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{b.subtitle}</p>
                                  <div className="flex items-center gap-2 mt-3">
                                    <Badge variant="outline" className="text-[9px] h-5 uppercase px-2 font-medium">{b.media_type}</Badge>
                                    <Badge variant="secondary" className="text-[9px] h-5 uppercase px-2 font-medium">{b.cta_text}</Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                                 <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                                   {b.marquee_text ? `Marquee: ${b.marquee_text.substring(0, 20)}...` : 'No marquee text'}
                                 </div>
                                 <div className="flex gap-2">
                                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleEditBanner(b, 'regular')}>
                                      <Settings2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="destructive" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleDeleteBanner(b.id)}>
                                      <Trash className="w-4 h-4" />
                                    </Button>
                                 </div>
                              </div>
                            </div>
                          ))}
                          {filteredBanners.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-secondary/5 rounded-3xl border-2 border-dashed border-border/20">
                               <Zap className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                               <p className="text-muted-foreground text-sm italic">No banners found.</p>
                            </div>
                          )}
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="samples" className="mt-0 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                 {/* Upload Card */}
                 <div className="md:col-span-4 space-y-6">
                    <Card className="border-gold/20 bg-gold/5 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-xl font-display font-bold">Upload Portfolio</CardTitle>
                        <CardDescription>Add new AI images or videos.</CardDescription>
                      </CardHeader>
                      <CardContent>
                         <form onSubmit={handleUploadSample} className="space-y-4">
                           <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Project Title</label>
                             <Input placeholder="e.g. Rolex Luxury Ad" value={title} onChange={e => setTitle(e.target.value)} />
                           </div>
                           <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Media File</label>
                             <Input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="bg-background" />
                           </div>
                           <Button className="w-full" disabled={uploading}>
                             {uploading ? "Saving..." : (editingSampleId ? "Update Portfolio" : "Publish Portfolio")}
                           </Button>
                           {editingSampleId && (
                             <Button variant="ghost" className="w-full text-xs" onClick={() => {
                               setEditingSampleId(null);
                               setTitle("");
                             }}>Cancel Edit</Button>
                           )}
                         </form>
                      </CardContent>
                    </Card>
                 </div>

                 {/* Portfolio Grid */}
                 <div className="md:col-span-8">
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between bg-secondary/10 pb-6 border-b border-border/30">
                        <div>
                          <CardTitle className="text-xl font-display font-bold">Active Portfolio</CardTitle>
                          <CardDescription>Manage shown images and videos.</CardDescription>
                        </div>
                        <div className="relative w-48">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                           <Input 
                            placeholder="Search projects..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="pl-8 h-8 text-xs bg-background border-border/50"
                           />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <Tabs defaultValue="videos" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50 p-1 h-10">
                            <TabsTrigger value="videos" className="text-xs">AI Videos ({filteredSamples.filter(s => s.media_type === "video").length})</TabsTrigger>
                            <TabsTrigger value="images" className="text-xs">AI Images ({filteredSamples.filter(s => s.media_type === "image").length})</TabsTrigger>
                          </TabsList>

                          <TabsContent value="videos" className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {filteredSamples.filter(s => s.media_type === "video").map(s => (
                               <div key={s.id} className="relative group rounded-xl overflow-hidden border border-border/50 bg-black aspect-square">
                                  <video src={s.media_url} className="w-full h-full object-cover opacity-80" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                                     <p className="text-[10px] font-bold text-white text-center mb-2 line-clamp-2">{s.title}</p>
                                     <div className="flex gap-2">
                                        <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => handleEditSample(s)}><Settings2 className="w-3.5 h-3.5" /></Button>
                                        <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => handleDeleteSample(s.id, s.media_url)}><Trash className="w-3.5 h-3.5" /></Button>
                                     </div>
                                  </div>
                               </div>
                            ))}
                            {filteredSamples.filter(s => s.media_type === "video").length === 0 && (
                               <div className="col-span-full py-20 text-center bg-secondary/5 rounded-2xl border-2 border-dashed border-border/30">
                                  <p className="text-muted-foreground text-sm italic">No AI Videos found.</p>
                               </div>
                            )}
                          </TabsContent>

                          <TabsContent value="images" className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {filteredSamples.filter(s => s.media_type === "image").map(s => (
                               <div key={s.id} className="relative group rounded-xl overflow-hidden border border-border/50 aspect-square">
                                  <img src={s.media_url} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                                     <p className="text-[10px] font-bold text-white text-center mb-2 line-clamp-2">{s.title}</p>
                                     <div className="flex gap-2">
                                        <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => handleEditSample(s)}><Settings2 className="w-3.5 h-3.5" /></Button>
                                        <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => handleDeleteSample(s.id, s.media_url)}><Trash className="w-3.5 h-3.5" /></Button>
                                     </div>
                                  </div>
                               </div>
                            ))}
                            {filteredSamples.filter(s => s.media_type === "image").length === 0 && (
                               <div className="col-span-full py-20 text-center bg-secondary/5 rounded-2xl border-2 border-dashed border-border/30">
                                  <p className="text-muted-foreground text-sm italic">No AI Images found.</p>
                               </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                 </div>
               </div>
            </TabsContent>

            <TabsContent value="prompts" className="mt-0 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Form */}
                  <div className="md:col-span-4">
                    <Card className="shadow-sm">
                       <CardHeader>
                          <CardTitle className="text-xl font-display font-bold">Prompt Builder</CardTitle>
                          <CardDescription>Save creative AI prompts.</CardDescription>
                       </CardHeader>
                       <CardContent>
                          <form onSubmit={handleSavePrompt} className="space-y-4">
                             <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Title</label>
                               <Input placeholder="e.g. Cinematic Watch" value={promptForm.title} onChange={e => setPromptForm({...promptForm, title: e.target.value})} />
                             </div>
                             <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Brand</label>
                               <Input placeholder="e.g. Rolex" value={promptForm.brand} onChange={e => setPromptForm({...promptForm, brand: e.target.value})} />
                             </div>
                             <div className="space-y-1">
                               <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Cover Preview</label>
                               <Input type="file" onChange={e => setPromptFile(e.target.files?.[0] || null)} className="bg-secondary/30" />
                             </div>
                             <div className="space-y-1">
                               <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Image Prompt</label>
                               <textarea className="w-full bg-secondary/30 border border-border p-3 rounded-lg text-sm min-h-[100px] outline-none focus:ring-1 focus:ring-gold/30 transition-all" placeholder="Enter detailed prompt..." value={promptForm.image_prompt} onChange={e => setPromptForm({...promptForm, image_prompt: e.target.value})} />
                             </div>
                             <div className="space-y-1">
                               <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Video Prompt</label>
                               <textarea className="w-full bg-secondary/30 border border-border p-3 rounded-lg text-sm min-h-[100px] outline-none focus:ring-1 focus:ring-gold/30 transition-all" placeholder="Enter video motion prompt..." value={promptForm.video_prompt} onChange={e => setPromptForm({...promptForm, video_prompt: e.target.value})} />
                             </div>
                             <Button type="submit" className="w-full" disabled={uploading}>
                                {uploading ? "Saving..." : (editingPromptId ? "Update Prompt" : "Save to Library")}
                             </Button>
                             {editingPromptId && (
                               <Button variant="ghost" className="w-full text-xs" onClick={() => {
                                 setEditingPromptId(null);
                                 setPromptForm({ title: '', brand: '', image_prompt: '', negative_prompt: '', video_prompt: '', media_url: '', is_free: true });
                               }}>Cancel Edit</Button>
                             )}
                          </form>
                       </CardContent>
                    </Card>
                  </div>

                  {/* List */}
                  <div className="md:col-span-8">
                    <Card className="shadow-sm">
                       <CardHeader className="flex flex-row items-center justify-between pb-6">
                          <div>
                            <CardTitle className="text-xl font-display font-bold">Prompts Library</CardTitle>
                            <CardDescription>Your saved AI ad concepts.</CardDescription>
                          </div>
                          <div className="relative w-48">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                             <Input 
                              placeholder="Search library..." 
                              value={searchTerm} 
                              onChange={(e) => setSearchTerm(e.target.value)} 
                              className="pl-8 h-8 text-xs bg-secondary/50 border-none"
                             />
                          </div>
                       </CardHeader>
                       <CardContent>
                          <Table>
                             <TableHeader>
                               <TableRow className="hover:bg-transparent">
                                 <TableHead>Preview</TableHead>
                                 <TableHead>Brand & Title</TableHead>
                                 <TableHead className="text-right">Actions</TableHead>
                               </TableRow>
                             </TableHeader>
                             <TableBody>
                                {filteredPrompts.map(p => (
                                   <TableRow key={p.id} className="group">
                                      <TableCell>
                                         <div className="w-16 h-16 rounded-xl overflow-hidden border border-border/50 bg-secondary/20 shadow-sm">
                                            {p.media_url ? (
                                              <img src={p.media_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground uppercase font-bold tracking-widest px-2 text-center italic">No Preview</div>
                                            )}
                                         </div>
                                      </TableCell>
                                      <TableCell>
                                         <div className="text-sm font-bold">{p.title}</div>
                                         <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.1em] mt-1">{p.brand}</div>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditPrompt(p)}><Settings2 className="w-4 h-4 text-muted-foreground" /></Button>
                                          <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeletePrompt(p.id)}><Trash className="w-4 h-4" /></Button>
                                        </div>
                                      </TableCell>
                                   </TableRow>
                                ))}
                                {filteredPrompts.length === 0 && (
                                  <TableRow>
                                    <TableCell colSpan={3} className="text-center py-20 text-muted-foreground italic">No prompts found.</TableCell>
                                  </TableRow>
                                )}
                             </TableBody>
                          </Table>
                       </CardContent>
                    </Card>
                  </div>
               </div>
            </TabsContent>
          </main>
        </div>
        </Tabs>

      </div>
    </div>
  );
}
