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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setSession(session);
        fetchLeads();
        fetchSamples();
        fetchOfferStats();
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
            <TabsTrigger value="samples">Manage Samples</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
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
                    <Button onClick={handleResetOffer} variant="destructive" className="w-full">
                      <RotateCcw className="w-4 h-4 mr-2" /> Reset Claims (Start New Campaign)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Submissions</CardTitle>
                  <CardDescription>View all leads and their offer eligibility status.</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto">
                  {loadingLeads ? (
                    <p>Loading leads...</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="font-medium">
                              {lead.name}
                              <div className="text-xs text-muted-foreground">{lead.email}</div>
                              <div className="text-xs text-muted-foreground">{lead.product_type}</div>
                            </TableCell>
                            <TableCell>{lead.phone}</TableCell>
                            <TableCell>
                              {lead.is_offer_eligible ? (
                                <Badge className="bg-green-500 hover:bg-green-600">₹399 Offer</Badge>
                              ) : (
                                <Badge variant="secondary">Standard</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
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
