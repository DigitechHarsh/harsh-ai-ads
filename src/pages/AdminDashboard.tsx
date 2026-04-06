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
import { Trash, LogOut, Settings2, RotateCcw } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  const [samples, setSamples] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Offer Stats
  const [offerStats, setOfferStats] = useState<{ total_claimed: number; claim_limit: number } | null>(null);
  const [newLimit, setNewLimit] = useState("");

  // Prompts
  const [prompts, setPrompts] = useState<any[]>([]);
  const [promptForm, setPromptForm] = useState({ title: '', brand: '', image_prompt: '', negative_prompt: '', video_prompt: '', media_url: '', is_free: true });

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignBrand, setCampaignBrand] = useState("");
  const [campaignFile, setCampaignFile] = useState<File | null>(null);
  const [campaignUrl, setCampaignUrl] = useState("");

  const fetchPrompts = async () => {
    const { data: pData, error: pError } = await supabase.from("reel_prompts").select("*").order("created_at", { ascending: false });
    if (!pError && pData) setPrompts(pData);
    
    const { data: cData, error: cError } = await supabase.from("prompt_campaigns").select("*");
    if (!cError && cData) setCampaigns(cData);
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
    const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (!error && data) setLeads(data);
    setLoadingLeads(false);
  };

  const fetchSamples = async () => {
    const { data, error } = await supabase.from("samples").select("*").order("created_at", { ascending: false });
    if (!error && data) setSamples(data);
  };

  const fetchOfferStats = async () => {
    const { data, error } = await supabase.from("offer_tracker").select("total_claimed, claim_limit").eq("id", 1).single();
    if (!error && data) {
      setOfferStats(data);
      setNewLimit(String(data.claim_limit || 20));
    }
  };

  const handleUpdateLimit = async () => {
    const limitNum = parseInt(newLimit);
    if (isNaN(limitNum) || limitNum < 1) return toast.error("Please enter a valid number");
    
    const { error } = await supabase.from("offer_tracker").update({ claim_limit: limitNum }).eq("id", 1);
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

    const { error } = await supabase.from("offer_tracker").update({ total_claimed: 0 }).eq("id", 1);
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

    // Upload to storage
    const { error: uploadError } = await supabase.storage.from("portfolio").upload(filePath, file);

    if (uploadError) {
      toast.error(uploadError.message);
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(filePath);

    const mediaType = file.type.startsWith("video/") ? "video" : "image";

    const { error: dbError } = await supabase.from("samples").insert({
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

    const { error: dbError } = await supabase.from("prompt_campaigns").upsert({
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
      fetchPrompts(); // re-fetch campaigns
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


  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptForm.title || !promptForm.brand) return toast.error("Title and Brand are required");
    
    // Ensure is_free is a boolean
    const payload = {
       ...promptForm,
       is_free: String(promptForm.is_free) === "true" || promptForm.is_free === true
    };
    
    const { error } = await supabase.from("reel_prompts").insert([payload]);
    if (!error) {
      toast.success("Prompt added!");
      setPromptForm({ title: '', brand: '', image_prompt: '', negative_prompt: '', video_prompt: '', media_url: '', is_free: true });
      fetchPrompts();
    } else {
      toast.error(error.message);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    const { error } = await supabase.from("reel_prompts").delete().eq("id", id);
    if (!error) {
      toast.success("Prompt deleted");
      fetchPrompts();
    } else {
      toast.error(error.message);
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
          <h1 className="text-2xl font-bold font-display">Harsh AI Creations Admin</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="leads">Manage Leads</TabsTrigger>
            <TabsTrigger value="offers">Offer Settings</TabsTrigger>
            <TabsTrigger value="samples">Manage Samples</TabsTrigger>
            <TabsTrigger value="prompts">Prompts Library</TabsTrigger>
          </TabsList>
          
          <TabsContent value="offers" className="space-y-6">
            <Card className="bg-primary/5 border-primary/20 max-w-2xl">
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
                  <Button onClick={handleResetOffer} variant="destructive" className="w-full">
                    <RotateCcw className="w-4 h-4 mr-2" /> Reset Claims (Start New Campaign)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Submissions</CardTitle>
                <CardDescription>View all leads and their offer eligibility status.</CardDescription>
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
                      {leads.map((lead) => (
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

          <TabsContent value="prompts" className="space-y-8">

            {/* Campaign Covers Management */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle>Campaign Covers</CardTitle>
                  <CardDescription>Upload a cover image for a product brand.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveCampaign} className="space-y-4">
                    <Input placeholder="Brand Name (e.g. Monster Energy)" value={campaignBrand} onChange={(e) => setCampaignBrand(e.target.value)} required />
                    
                    <div className="space-y-2 p-3 bg-black/20 rounded-md border border-border/50">
                      <label className="text-xs font-semibold text-muted-foreground uppercase opacity-80">Option 1: Device Upload</label>
                      <Input type="file" accept="image/*" onChange={(e) => setCampaignFile(e.target.files?.[0] || null)} />
                    </div>

                    <div className="space-y-2 p-3 bg-black/20 rounded-md border border-border/50">
                      <label className="text-xs font-semibold text-muted-foreground uppercase opacity-80">Option 2: Drive URL / Image Link</label>
                      <Input placeholder="Or paste any URL..." value={campaignUrl} onChange={(e) => setCampaignUrl(e.target.value)} />
                    </div>
                    
                    <Button type="submit" disabled={uploading} className="w-full mt-2">
                      {uploading ? "Saving..." : "Save Cover"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Active Campaigns</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  {campaigns.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No campaign covers set yet.</p>
                  ) : (
                    campaigns.map(c => (
                      <div key={c.brand_name} className="relative group w-32 h-32 rounded-xl overflow-hidden border border-border">
                        <img src={c.image_url} alt={c.brand_name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2 text-center text-xs font-bold leading-tight">
                          {c.brand_name}
                        </div>
                        <Button 
                          variant="destructive" size="icon" className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100"
                          onClick={() => handleDeleteCampaign(c.brand_name)}>
                          <Trash className="w-3 h-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Prompts Management */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle>Add New Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSavePrompt} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input value={promptForm.title} onChange={(e) => setPromptForm({...promptForm, title: e.target.value})} placeholder="e.g. Shot 1 - Top Down" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Brand / Group</label>
                      <Input value={promptForm.brand} onChange={(e) => setPromptForm({...promptForm, brand: e.target.value})} placeholder="e.g. Monster Energy" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Image Prompt</label>
                      <textarea className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]" value={promptForm.image_prompt} onChange={(e) => setPromptForm({...promptForm, image_prompt: e.target.value})} placeholder="Main prompt..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Negative Prompt</label>
                      <textarea className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[60px]" value={promptForm.negative_prompt} onChange={(e) => setPromptForm({...promptForm, negative_prompt: e.target.value})} placeholder="Negative..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Video Generation Prompt (JSON/Notes)</label>
                      <textarea className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[150px] font-mono text-xs" value={promptForm.video_prompt} onChange={(e) => setPromptForm({...promptForm, video_prompt: e.target.value})} placeholder="Video animation prompt..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pricing Status</label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                         value={promptForm.is_free ? "true" : "false"} onChange={(e) => setPromptForm({...promptForm, is_free: e.target.value === "true"})}>
                        <option value="true">Free (Public)</option>
                        <option value="false">Paid (Premium)</option>
                      </select>
                    </div>
                    <Button type="submit" className="w-full">
                      Save Prompt
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Existing Prompts</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Brand</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prompts.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium text-xs">{p.brand}</TableCell>
                          <TableCell className="text-sm">{p.title}</TableCell>
                          <TableCell>
                            {p.is_free ? (
                              <Badge className="bg-green-500 hover:bg-green-600 text-[10px]">Free</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px]">Paid</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleDeletePrompt(p.id)} className="text-red-500 h-8 px-2">
                              <Trash className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="samples">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle>Upload New Sample</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUploadSample} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Nike Sneakers" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Media File (Image or Video)</label>
                      <Input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={uploading}>
                      {uploading ? "Uploading..." : "Upload Portfolio Sample"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Active Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {samples.map((s) => (
                      <div key={s.id} className="relative group rounded-xl overflow-hidden border bg-background">
                        {s.media_type === "video" ? (
                          <video src={s.media_url} className="w-full aspect-square object-cover" muted loop autoPlay playsInline disablePictureInPicture />
                        ) : (
                          <img src={s.media_url} alt={s.title} className="w-full aspect-square object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                          <span className="text-white font-medium text-center mb-2">{s.title}</span>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteSample(s.id, s.media_url)}>
                            <Trash className="w-4 h-4 mr-2" /> Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
