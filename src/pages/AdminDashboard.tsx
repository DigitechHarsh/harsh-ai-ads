import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Trash, LogOut, Settings2, RotateCcw, ExternalLink,
  Users, Zap, Layout as LayoutIcon, Sparkles, Search,
  Download, StickyNote, ChevronDown, ChevronUp,
  TrendingUp, BarChart3, PieChart, Activity, Flame,
  ThermometerSun, Snowflake, CheckCircle2, Clock, PackageOpen
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────
type LeadTag = "hot" | "warm" | "cold" | null;
type LeadStatus = "new" | "in-progress" | "delivered";
interface LeadMeta { tag: LeadTag; status: LeadStatus; note: string; }

// ─── Tag config ──────────────────────────────────────────
const TAG_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  hot:  { label: "Hot",  color: "text-red-400",    bg: "bg-red-500/10 border-red-500/30",    icon: <Flame className="w-3 h-3" /> },
  warm: { label: "Warm", color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/30", icon: <ThermometerSun className="w-3 h-3" /> },
  cold: { label: "Cold", color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/30",   icon: <Snowflake className="w-3 h-3" /> },
};

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  "new":         { label: "New",         color: "text-purple-400",  bg: "bg-purple-500/10 border-purple-500/30",  icon: <PackageOpen className="w-3 h-3" /> },
  "in-progress": { label: "In Progress", color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/30",    icon: <Clock className="w-3 h-3" /> },
  "delivered":   { label: "Delivered",   color: "text-green-400",   bg: "bg-green-500/10 border-green-500/30",    icon: <CheckCircle2 className="w-3 h-3" /> },
};

// ─── Mini Bar Chart ───────────────────────────────────────
const MiniBar = ({ value, max, color }: { value: number; max: number; color: string }) => (
  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
    <div
      className={`h-full rounded-full transition-all duration-700 ${color}`}
      style={{ width: max > 0 ? `${Math.round((value / max) * 100)}%` : "0%" }}
    />
  </div>
);

// ─── Analytics Tab ────────────────────────────────────────
const AnalyticsTab = ({ leads, offerStats, samples, prompts }: any) => {
  const now = new Date();

  // Leads this week vs last week
  const thisWeek = leads.filter((l: any) => {
    const d = new Date(l.created_at);
    return (now.getTime() - d.getTime()) < 7 * 24 * 3600 * 1000;
  }).length;
  const lastWeek = leads.filter((l: any) => {
    const d = new Date(l.created_at);
    const diff = now.getTime() - d.getTime();
    return diff >= 7 * 24 * 3600 * 1000 && diff < 14 * 24 * 3600 * 1000;
  }).length;

  // Leads by day (last 7 days)
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const leadsPerDay = Array(7).fill(0);
  leads.forEach((l: any) => {
    const d = new Date(l.created_at);
    const diff = Math.floor((now.getTime() - d.getTime()) / (24 * 3600 * 1000));
    if (diff >= 0 && diff < 7) {
      const dayIdx = d.getDay();
      leadsPerDay[dayIdx]++;
    }
  });
  const maxDay = Math.max(...leadsPerDay, 1);

  // Product type breakdown
  const productTypes: Record<string, number> = {};
  leads.forEach((l: any) => {
    const t = l.product_type || "Other";
    productTypes[t] = (productTypes[t] || 0) + 1;
  });
  const sortedTypes = Object.entries(productTypes).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxType = Math.max(...sortedTypes.map(e => e[1]), 1);

  // Offer progress
  const claimed = offerStats?.total_claimed || 0;
  const limit = offerStats?.claim_limit || 20;
  const offerPct = Math.round((claimed / limit) * 100);

  // Hot leads count
  const hotLeads = leads.filter((_: any, i: number) => {
    const stored = localStorage.getItem(`lead_meta_${leads[i]?.id}`);
    if (!stored) return false;
    try { return JSON.parse(stored).tag === "hot"; } catch { return false; }
  }).length;

  const statCards = [
    { label: "Total Leads",     value: leads.length,  icon: <Users className="w-5 h-5" />,        color: "text-blue-400",   bg: "bg-blue-500/10" },
    { label: "This Week",       value: thisWeek,       icon: <TrendingUp className="w-5 h-5" />,   color: "text-green-400",  bg: "bg-green-500/10" },
    { label: "Last Week",       value: lastWeek,       icon: <BarChart3 className="w-5 h-5" />,    color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Offer Claims",    value: claimed,        icon: <Zap className="w-5 h-5" />,          color: "text-gold",       bg: "bg-gold/10" },
    { label: "Portfolio Items", value: samples.length, icon: <LayoutIcon className="w-5 h-5" />,   color: "text-cyan-400",   bg: "bg-cyan-500/10" },
    { label: "Prompts Saved",   value: prompts.length, icon: <Sparkles className="w-5 h-5" />,     color: "text-pink-400",   bg: "bg-pink-500/10" },
  ];

  const COLORS = ["bg-gold", "bg-purple-400", "bg-cyan-400", "bg-pink-400", "bg-green-400", "bg-orange-400"];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((s, i) => (
          <Card key={i} className="bg-secondary/10 border-border/50">
            <CardContent className="p-4">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2 ${s.color}`}>
                {s.icon}
              </div>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads This Week Bar Chart */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-gold" /> Leads — Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-28">
              {leadsPerDay.map((count, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground font-bold">{count > 0 ? count : ""}</span>
                  <div className="w-full rounded-t-lg bg-gold/20 relative overflow-hidden" style={{ height: `${Math.max((count / maxDay) * 88, count > 0 ? 8 : 2)}px` }}>
                    <div className="absolute inset-0 bg-gold opacity-70 rounded-t-lg" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{dayLabels[i]}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/30 flex items-center gap-3">
              <div className="text-sm">
                <span className="font-black text-green-400">{thisWeek > lastWeek ? "+" : ""}{thisWeek - lastWeek}</span>
                <span className="text-muted-foreground text-xs ml-1">vs last week</span>
              </div>
              {thisWeek >= lastWeek
                ? <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">↑ Growing</Badge>
                : <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">↓ Slower</Badge>
              }
            </div>
          </CardContent>
        </Card>

        {/* Product Type Breakdown */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" /> Leads by Product Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedTypes.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-8">No leads yet.</p>
            ) : (
              <div className="space-y-3">
                {sortedTypes.map(([type, count], i) => (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium truncate max-w-[160px]">{type}</span>
                      <span className="font-black text-muted-foreground">{count}</span>
                    </div>
                    <MiniBar value={count} max={maxType} color={COLORS[i % COLORS.length]} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Offer Progress */}
        <Card className="border-gold/20 bg-gold/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-gold" /> Offer Claim Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-black text-gold">{offerPct}%</span>
              <span className="text-muted-foreground text-sm mb-1">filled ({claimed}/{limit})</span>
            </div>
            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-gradient rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{ width: `${offerPct}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
              <span>0</span>
              <span className="text-gold font-bold">{limit - claimed} slots left</span>
              <span>{limit}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Activity Feed */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
              {leads.slice(0, 6).map((lead: any, i: number) => (
                <div key={lead.id} className="flex items-center gap-3 py-1 border-b border-border/20 last:border-0">
                  <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-black flex-shrink-0">
                    {lead.name?.[0] || "?"}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-bold truncate">{lead.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{lead.brand_name}</p>
                  </div>
                  <span className="text-[9px] text-muted-foreground flex-shrink-0">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {leads.length === 0 && <p className="text-sm text-muted-foreground italic text-center py-6">No leads yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────
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
  const [isTeaser, setIsTeaser] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Offer Stats
  const [offerStats, setOfferStats] = useState<{ total_claimed: number; claim_limit: number; floating_bubble_enabled?: boolean; floating_bubble_text?: string; floating_bubble_cta?: string; } | null>(null);
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

  // ── NEW: Lead Meta (Tags, Status, Notes) stored in localStorage ──
  const [leadMeta, setLeadMeta] = useState<Record<string, LeadMeta>>({});
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState("");

  // Load lead meta from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("lead_meta_all");
    if (stored) {
      try { setLeadMeta(JSON.parse(stored)); } catch {}
    }
  }, []);

  const saveLeadMeta = (updated: Record<string, LeadMeta>) => {
    setLeadMeta(updated);
    localStorage.setItem("lead_meta_all", JSON.stringify(updated));
  };

  const getLeadMeta = (id: string): LeadMeta =>
    leadMeta[id] || { tag: null, status: "new", note: "" };

  const setLeadTag = (id: string, tag: LeadTag) => {
    const cur = getLeadMeta(id);
    const cur2 = cur.tag === tag ? { ...cur, tag: null as LeadTag } : { ...cur, tag };
    saveLeadMeta({ ...leadMeta, [id]: cur2 });
  };

  const setLeadStatus = (id: string, status: LeadStatus) => {
    saveLeadMeta({ ...leadMeta, [id]: { ...getLeadMeta(id), status } });
  };

  const saveNote = (id: string) => {
    saveLeadMeta({ ...leadMeta, [id]: { ...getLeadMeta(id), note: editingNote } });
    setExpandedNoteId(null);
    toast.success("Note saved!");
  };

  // ── CSV Export ──
  const exportCSV = () => {
    if (leads.length === 0) return toast.error("No leads to export!");
    const headers = ["Date", "Name", "Brand", "Phone", "Email", "Product Type", "Status", "Tag", "Offer", "Note"];
    const rows = leads.map(l => {
      const meta = getLeadMeta(l.id);
      return [
        new Date(l.created_at).toLocaleDateString(),
        l.name || "",
        l.brand_name || "",
        l.phone || "",
        l.email || "",
        l.product_type || "",
        meta.status,
        meta.tag || "—",
        l.is_offer_eligible ? "Yes (₹399)" : "No",
        `"${(meta.note || "").replace(/"/g, "'")}"`,
      ].join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${leads.length} leads as CSV!`);
  };

  // ── Auth & API ──
  const authFetch = async (url: string, options: any = {}) => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); throw new Error("No token"); }
    const headers = { ...options.headers, Authorization: `Bearer ${token}` };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      localStorage.removeItem("token");
      toast.error("Session expired. Please login again.");
      navigate("/login");
      throw new Error("Unauthorized");
    }
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
    if (!token) { navigate("/login"); }
    else {
      setSession({ token });
      fetchLeads();
      fetchSamples();
      fetchOfferStats();
      fetchPrompts();
    }
  }, [navigate]);

  const fetchLeads = async () => {
    try {
      const data = await authFetch("/api/leads");
      setLeads(data);
      setSiteStats(prev => ({ ...prev, total_leads: data.length }));
    } catch(e) {}
    setLoadingLeads(false);
  };

  const fetchSamples = async () => {
    try { setSamples(await fetch("/api/portfolio").then(r => r.json())); } catch(e) {}
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
      await authFetch("/api/offers", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ claim_limit: limitNum }) });
      toast.success("Offer limit updated!");
      fetchOfferStats();
    } catch(e) { toast.error("Failed to update limit"); }
  };

  const handleResetOffer = async () => {
    if (!window.confirm("Reset claimed count to 0?")) return;
    try {
      await authFetch("/api/offers", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ total_claimed: 0 }) });
      toast.success("Offer claims reset to 0!");
      fetchOfferStats();
    } catch(e) { toast.error("Failed to reset claims"); }
  };

  const handleUploadSample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return toast.error("Please provide a title");
    if (!file && !editingSampleId) return toast.error("Please provide a file");
    setUploading(true);
    try {
      let publicUrl = undefined, mediaType = undefined;
      if (file) {
        publicUrl = await uploadToCloudinary(file);
        mediaType = isTeaser ? "teaser" : (file.type.startsWith("video/") ? "video" : "image");
      }
      const payload: any = { title };
      if (publicUrl) payload.media_url = publicUrl;
      if (mediaType) payload.media_type = mediaType;
      const url = editingSampleId ? `/api/portfolio?id=${editingSampleId}` : "/api/portfolio";
      await authFetch(url, { method: editingSampleId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      toast.success(editingSampleId ? "Sample updated!" : "Sample added!");
      setTitle(""); setFile(null); setEditingSampleId(null); setIsTeaser(false);
      fetchSamples();
    } catch(e: any) { toast.error(e.message); }
    setUploading(false);
  };

  const handleEditSample = (sample: any) => {
    setEditingSampleId(sample.id); setTitle(sample.title);
    setIsTeaser(sample.media_type === "teaser"); setFile(null);
    toast.info("Editing Sample."); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteSample = async (id: string) => {
    try { await authFetch(`/api/portfolio?id=${id}`, { method: "DELETE" }); toast.success("Sample deleted"); fetchSamples(); }
    catch(e: any) { toast.error(e.message); }
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignBrand) return toast.error("Brand name required");
    if (!campaignFile && !campaignUrl && !editingCampaignId) return toast.error("Image file OR link required");
    setUploading(true);
    let finalUrl = campaignUrl;
    try {
      if (campaignFile) finalUrl = await uploadToCloudinary(campaignFile);
      const payload: any = { brand_name: campaignBrand };
      if (finalUrl) payload.image_url = finalUrl;
      const url = editingCampaignId ? `/api/campaigns?id=${editingCampaignId}` : "/api/campaigns";
      await authFetch(url, { method: editingCampaignId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      toast.success(editingCampaignId ? "Campaign Updated!" : "Campaign Saved!");
      setCampaignBrand(""); setCampaignFile(null); setCampaignUrl(""); setEditingCampaignId(null);
      fetchPrompts();
    } catch(e: any) { toast.error(e.message); }
    setUploading(false);
  };

  const handleEditCampaign = (c: any) => {
    setEditingCampaignId(c.id); setCampaignBrand(c.brand_name); setCampaignUrl(c.image_url); setCampaignFile(null);
    toast.info("Editing Campaign."); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCampaign = async (id: string) => {
    try { await authFetch(`/api/campaigns?id=${id}`, { method: "DELETE" }); toast.success("Campaign deleted"); fetchPrompts(); }
    catch(e: any) { toast.error(e.message); }
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
      if (currentFile) publicUrl = await uploadToCloudinary(currentFile);
      const payload: any = { ...currentForm };
      if (publicUrl) payload.media_url = publicUrl;
      const url = editingId ? `/api/hero?id=${editingId}` : "/api/hero";
      await authFetch(url, { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      toast.success(editingId ? "Updated!" : (type === 'regular' ? "Banner Added!" : "Offer Added!"));
      if (type === 'regular') {
        setBannerForm({ title: '', subtitle: '', cta_text: 'Get Started', cta_link: '#form', media_type: 'image', is_offer: false, marquee_text: '' });
        setBannerFile(null); setEditingBannerId(null);
      } else {
        setOfferForm({ title: '', subtitle: '', cta_text: 'Claim Offer', cta_link: '#form', media_type: 'image', marquee_text: '' });
        setOfferFile(null); setEditingOfferId(null);
      }
      fetchPrompts();
    } catch(e: any) { toast.error(e.message); }
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
    toast.info("Editing Banner."); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteBanner = async (id: string) => {
    try { await authFetch(`/api/hero?id=${id}`, { method: "DELETE" }); toast.success("Banner deleted"); fetchPrompts(); }
    catch(e: any) { toast.error(e.message); }
  };

  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptForm.title || !promptForm.brand) return toast.error("Title and Brand are required");
    setUploading(true);
    let finalImageUrl = promptForm.media_url;
    try {
      if (promptFile) finalImageUrl = await uploadToCloudinary(promptFile);
      const payload = { ...promptForm, media_url: finalImageUrl, is_free: String(promptForm.is_free) === "true" || promptForm.is_free === true };
      const url = editingPromptId ? `/api/prompts?id=${editingPromptId}` : "/api/prompts";
      await authFetch(url, { method: editingPromptId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      toast.success(editingPromptId ? "Prompt updated!" : "Prompt added!");
      setPromptForm({ title: '', brand: '', image_prompt: '', negative_prompt: '', video_prompt: '', media_url: '', is_free: true });
      setPromptFile(null); setEditingPromptId(null); fetchPrompts();
    } catch(e: any) { toast.error(e.message); }
    setUploading(false);
  };

  const handleEditPrompt = (prompt: any) => {
    setEditingPromptId(prompt.id);
    setPromptForm({ title: prompt.title, brand: prompt.brand, image_prompt: prompt.image_prompt, negative_prompt: prompt.negative_prompt || '', video_prompt: prompt.video_prompt || '', media_url: prompt.media_url, is_free: prompt.is_free });
    setPromptFile(null); toast.info("Editing Prompt."); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePrompt = async (id: string) => {
    try { await authFetch(`/api/prompts?id=${id}`, { method: "DELETE" }); toast.success("Prompt deleted"); fetchPrompts(); }
    catch(e: any) { toast.error(e.message); }
  };

  // Filtered lists
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
  const filteredSamples = samples.filter(s => s.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredPrompts = prompts.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gold-gradient">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Manage your leads, offers, and library.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2 border-green-500/30 text-green-400 hover:bg-green-500/10">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open('/', '_blank')} className="gap-2">
              <ExternalLink className="w-4 h-4" /> View Site
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { localStorage.removeItem("token"); navigate("/"); }} className="gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-secondary/10 border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Users className="w-6 h-6" /></div>
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
                <div className="p-3 bg-gold/10 text-gold rounded-xl"><Zap className="w-6 h-6" /></div>
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
                <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><LayoutIcon className="w-6 h-6" /></div>
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
                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Sparkles className="w-6 h-6" /></div>
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
                {[
                  { value: "submissions", icon: <Users className="w-4 h-4" />, label: "Submissions" },
                  { value: "analytics",   icon: <BarChart3 className="w-4 h-4" />, label: "Analytics" },
                  { value: "hero",        icon: <Zap className="w-4 h-4" />, label: "Offers & Banners" },
                  { value: "samples",     icon: <LayoutIcon className="w-4 h-4" />, label: "Portfolio" },
                  { value: "prompts",     icon: <Sparkles className="w-4 h-4" />, label: "Prompts" },
                ].map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className="w-full justify-start gap-3 py-3 px-4 data-[state=active]:bg-gold/10 data-[state=active]:text-gold transition-all">
                    {tab.icon} {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </aside>

            {/* Main Content */}
            <main className="flex-grow min-w-0">

              {/* ── ANALYTICS TAB ── */}
              <TabsContent value="analytics" className="mt-0">
                <AnalyticsTab leads={leads} offerStats={offerStats} samples={samples} prompts={prompts} />
              </TabsContent>

              {/* ── SUBMISSIONS TAB ── */}
              <TabsContent value="submissions" className="mt-0">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-0 pb-6 gap-4">
                    <div>
                      <CardTitle className="text-2xl font-display font-bold">Contact Submissions</CardTitle>
                      <CardDescription>View, tag, and track all leads.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search leads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 bg-secondary/50 border-none" />
                      </div>
                      <Button size="sm" onClick={exportCSV} className="gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 flex-shrink-0">
                        <Download className="w-3.5 h-3.5" /> CSV
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="max-h-[800px] overflow-y-auto custom-scrollbar">
                    {loadingLeads ? (
                      <div className="text-center py-20">
                        <RotateCcw className="w-8 h-8 animate-spin mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Loading leads...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredLeads.map((lead) => {
                          const meta = getLeadMeta(lead.id);
                          const statusCfg = STATUS_CONFIG[meta.status];
                          const isExpanded = expandedNoteId === lead.id;
                          return (
                            <div key={lead.id} className="rounded-2xl border border-border/40 bg-secondary/5 hover:bg-secondary/10 transition-all overflow-hidden">
                              <div className="p-4">
                                <div className="flex flex-wrap items-start gap-3">
                                  {/* Avatar */}
                                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-black text-base flex-shrink-0">
                                    {lead.name?.[0] || "?"}
                                  </div>

                                  {/* Lead Info */}
                                  <div className="flex-grow min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                      <span className="font-bold text-sm">{lead.name}</span>
                                      {lead.is_offer_eligible && (
                                        <Badge className="bg-gold/20 text-gold border-gold/30 text-[9px] h-4 px-1.5">₹399 Offer</Badge>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                                      <span className="font-bold uppercase tracking-wider">{lead.brand_name}</span>
                                      <span className="text-gold font-mono">{lead.phone}</span>
                                      {lead.email && <span>{lead.email}</span>}
                                      <span className="bg-secondary px-2 py-0.5 rounded text-[10px]">{lead.product_type}</span>
                                      <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                                    </div>
                                  </div>

                                  {/* Product images */}
                                  {lead.product_images && Array.isArray(lead.product_images) && lead.product_images.length > 0 && (
                                    <div className="flex gap-1">
                                      {(lead.product_images as string[]).slice(0, 3).map((img, idx) => (
                                        <a key={idx} href={img} target="_blank" rel="noreferrer">
                                          <img src={img} alt="Product" className="w-9 h-9 rounded-lg object-cover border border-border hover:border-gold transition-all" />
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Controls Row */}
                                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/20">

                                  {/* Status Dropdown */}
                                  <div className="relative">
                                    <select
                                      value={meta.status}
                                      onChange={(e) => setLeadStatus(lead.id, e.target.value as LeadStatus)}
                                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border appearance-none cursor-pointer pr-6 ${statusCfg.bg} ${statusCfg.color} bg-transparent outline-none`}
                                    >
                                      <option value="new">📦 New</option>
                                      <option value="in-progress">⚙️ In Progress</option>
                                      <option value="delivered">✅ Delivered</option>
                                    </select>
                                  </div>

                                  {/* Tag Buttons */}
                                  <div className="flex gap-1">
                                    {(["hot", "warm", "cold"] as LeadTag[]).map(tag => {
                                      if (!tag) return null;
                                      const cfg = TAG_CONFIG[tag];
                                      const isActive = meta.tag === tag;
                                      return (
                                        <button
                                          key={tag}
                                          onClick={() => setLeadTag(lead.id, tag)}
                                          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1.5 rounded-lg border transition-all ${
                                            isActive
                                              ? `${cfg.bg} ${cfg.color} scale-105`
                                              : "border-border/30 text-muted-foreground hover:border-border/60"
                                          }`}
                                        >
                                          {cfg.icon} {cfg.label}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Note toggle */}
                                  <button
                                    onClick={() => {
                                      if (isExpanded) { setExpandedNoteId(null); }
                                      else { setExpandedNoteId(lead.id); setEditingNote(meta.note || ""); }
                                    }}
                                    className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1.5 rounded-lg border transition-all ${
                                      meta.note ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "border-border/30 text-muted-foreground hover:border-border/60"
                                    }`}
                                  >
                                    <StickyNote className="w-3 h-3" />
                                    {meta.note ? "Note ✓" : "Add Note"}
                                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                  </button>
                                </div>

                                {/* Inline Note Editor */}
                                {isExpanded && (
                                  <div className="mt-3 space-y-2">
                                    <textarea
                                      value={editingNote}
                                      onChange={e => setEditingNote(e.target.value)}
                                      placeholder="Write a note about this lead... e.g. 'Callback scheduled for Friday'"
                                      className="w-full bg-background/50 border border-cyan-500/20 rounded-xl p-3 text-sm resize-none outline-none focus:border-cyan-500/50 transition-colors min-h-[80px]"
                                      autoFocus
                                    />
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={() => saveNote(lead.id)} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 text-xs h-7">
                                        Save Note
                                      </Button>
                                      <Button size="sm" variant="ghost" onClick={() => setExpandedNoteId(null)} className="text-xs h-7">
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {/* Show saved note (collapsed) */}
                                {!isExpanded && meta.note && (
                                  <div className="mt-2 px-3 py-2 bg-cyan-500/5 border border-cyan-500/15 rounded-lg text-[11px] text-cyan-300/80 italic">
                                    📝 {meta.note}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {filteredLeads.length === 0 && !loadingLeads && (
                          <div className="py-20 text-center bg-secondary/5 rounded-3xl border-2 border-dashed border-border/20">
                            <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                            <p className="text-muted-foreground text-sm italic">No leads found.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── OFFERS & BANNERS TAB ── */}
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
                      <div className="flex items-center gap-3 bg-background/50 p-2 rounded-xl border border-border/50">
                        <div className="flex flex-col px-2">
                          <span className="text-[8px] font-bold uppercase text-muted-foreground">Slots Left</span>
                          <span className="text-sm font-bold text-gold">{offerStats ? Math.max(offerStats.claim_limit - offerStats.total_claimed, 0) : '0'} / {offerStats?.claim_limit || '0'}</span>
                        </div>
                        <div className="w-[1px] h-8 bg-border/50" />
                        <div className="flex flex-col px-2">
                          <span className="text-[8px] font-bold uppercase text-muted-foreground">Total Claimed</span>
                          <span className="text-sm font-bold">{offerStats?.total_claimed || 0}</span>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Input type="number" value={newLimit} onChange={(e) => setNewLimit(e.target.value)} className="w-16 h-8 text-xs bg-background" placeholder="Limit" />
                          <Button size="icon" className="h-8 w-8" onClick={handleUpdateLimit} title="Update Limit"><Settings2 className="w-3 h-3" /></Button>
                          <Button size="icon" variant="destructive" className="h-8 w-8" onClick={handleResetOffer} title="Reset Claims"><RotateCcw className="w-3 h-3" /></Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
                      <div className="lg:col-span-4 space-y-4 bg-secondary/20 p-6 rounded-2xl border border-border/50 h-fit">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">{editingBannerId ? "Edit Banner" : "Add New Banner"}</h4>
                        <form onSubmit={handleSaveBanner} className="space-y-4">
                          <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Main Title</label><Input placeholder="e.g. SPECIAL OFFER" value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} className="bg-background" /></div>
                          <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Subtitle</label><Input placeholder="e.g. ₹399 ONLY" value={bannerForm.subtitle} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} className="bg-background" /></div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">CTA Text</label><Input placeholder="Get Started" value={bannerForm.cta_text} onChange={e => setBannerForm({...bannerForm, cta_text: e.target.value})} className="bg-background" /></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">CTA Link</label><Input placeholder="#form" value={bannerForm.cta_link} onChange={e => setBannerForm({...bannerForm, cta_link: e.target.value})} className="bg-background" /></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Media Type</label>
                              <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={bannerForm.media_type} onChange={e => setBannerForm({...bannerForm, media_type: e.target.value})}>
                                <option value="image">Image</option><option value="video">Video</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2 pt-6"><input type="checkbox" id="is_offer" checked={bannerForm.is_offer} onChange={e => setBannerForm({...bannerForm, is_offer: e.target.checked})} className="w-4 h-4" /><label htmlFor="is_offer" className="text-[10px] cursor-pointer font-bold uppercase">Activate Scarcity</label></div>
                          </div>
                          <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Marquee Text</label><textarea placeholder="PREMIUM • FAST • AI" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm min-h-[60px]" value={bannerForm.marquee_text} onChange={e => setBannerForm({...bannerForm, marquee_text: e.target.value})} /></div>
                          <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Upload Media</label><Input type="file" onChange={e => setBannerFile(e.target.files?.[0] || null)} className="bg-background" /></div>
                          <Button type="submit" className="w-full h-11 bg-gold hover:bg-gold-dark text-black font-bold" disabled={uploading}>{uploading ? "Saving..." : (editingBannerId ? "Update Banner" : "Publish Banner")}</Button>
                          {editingBannerId && <Button variant="ghost" className="w-full text-xs" onClick={() => { setEditingBannerId(null); setBannerForm({ title: '', subtitle: '', cta_text: 'Get Started', cta_link: '#form', media_type: 'image', is_offer: false, marquee_text: '' }); }}>Cancel Editing</Button>}
                        </form>
                      </div>
                      <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center justify-between mb-2 px-1">
                          <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Active Banners & Offers</h4>
                          <div className="relative w-56"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" /><Input placeholder="Search banners..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs bg-secondary/50 border-border/50" /></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                          {filteredBanners.map(b => (
                            <div key={b.id} className={`flex flex-col p-4 border rounded-2xl group transition-all hover:shadow-lg relative overflow-hidden ${b.is_offer ? 'bg-gold/5 border-gold/30' : 'bg-background border-border/50'}`}>
                              {b.is_offer && <div className="absolute top-0 right-0"><div className="bg-gold text-black text-[8px] font-bold px-3 py-1 rounded-bl-xl uppercase">Tracking Scarcity</div></div>}
                              <div className="flex gap-4">
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-black border border-border/50">
                                  {b.media_type === 'video' ? <div className="w-full h-full flex items-center justify-center bg-zinc-900"><Zap className="w-6 h-6 text-gold/50" /></div> : <img src={b.media_url} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-grow min-w-0">
                                  <h4 className={`font-bold text-base leading-tight truncate ${b.is_offer ? 'text-gold' : ''}`}>{b.title}</h4>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{b.subtitle}</p>
                                  <div className="flex items-center gap-2 mt-3"><Badge variant="outline" className="text-[9px] h-5">{b.media_type}</Badge><Badge variant="secondary" className="text-[9px] h-5">{b.cta_text}</Badge></div>
                                </div>
                              </div>
                              <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                                <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">{b.marquee_text ? `${b.marquee_text.substring(0, 20)}...` : 'No marquee'}</div>
                                <div className="flex gap-2">
                                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleEditBanner(b, 'regular')}><Settings2 className="w-4 h-4" /></Button>
                                  <Button variant="destructive" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleDeleteBanner(b.id)}><Trash className="w-4 h-4" /></Button>
                                </div>
                              </div>
                            </div>
                          ))}
                          {filteredBanners.length === 0 && <div className="col-span-full py-20 text-center bg-secondary/5 rounded-3xl border-2 border-dashed border-border/20"><Zap className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" /><p className="text-muted-foreground text-sm italic">No banners found.</p></div>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Floating Bubble Card */}
                  <Card className="border-gold/20 bg-gold/5 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-display font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-gold" /> Floating Offer Bubble</CardTitle>
                      <CardDescription>Control the bouncing 3D offer widget on the live site.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border/50">
                        <div><p className="text-sm font-bold">Enable Bubble</p><p className="text-[11px] text-muted-foreground">Bounce widget appears after 5s on live site</p></div>
                        <input type="checkbox" className="w-5 h-5 rounded cursor-pointer accent-gold" checked={offerStats?.floating_bubble_enabled || false} onChange={async (e) => { try { await authFetch("/api/offers", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ floating_bubble_enabled: e.target.checked }) }); fetchOfferStats(); toast.success(e.target.checked ? "Bubble enabled!" : "Bubble disabled!"); } catch {} }} />
                      </div>
                      <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Bubble Offer Text</label><Input placeholder="🔥 Special Offer! Only ₹399" defaultValue={offerStats?.floating_bubble_text || ""} id="bubbleText" className="bg-background" /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">CTA Button Label</label><Input placeholder="Grab Now" defaultValue={offerStats?.floating_bubble_cta || ""} id="bubbleCta" className="bg-background" /></div>
                      <Button className="w-full bg-gold hover:bg-gold text-black font-bold" onClick={async () => { const text = (document.getElementById("bubbleText") as HTMLInputElement)?.value; const cta = (document.getElementById("bubbleCta") as HTMLInputElement)?.value; try { await authFetch("/api/offers", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ floating_bubble_text: text, floating_bubble_cta: cta }) }); toast.success("Bubble settings saved!"); } catch {} }}>Save Bubble Settings</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* ── PORTFOLIO TAB ── */}
              <TabsContent value="samples" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-4 space-y-6">
                    <Card className="border-gold/20 bg-gold/5 shadow-sm">
                      <CardHeader><CardTitle className="text-xl font-display font-bold">Upload Portfolio</CardTitle><CardDescription>Add new AI images or videos.</CardDescription></CardHeader>
                      <CardContent>
                        <form onSubmit={handleUploadSample} className="space-y-4">
                          <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Project Title</label><Input placeholder="e.g. Rolex Luxury Ad" value={title} onChange={e => setTitle(e.target.value)} /></div>
                          <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Media File</label><Input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="bg-background" /></div>
                          <div className="flex items-center gap-2 mt-2"><input type="checkbox" id="isTeaser" checked={isTeaser} onChange={(e) => setIsTeaser(e.target.checked)} className="rounded" /><label htmlFor="isTeaser" className="text-xs font-medium text-muted-foreground cursor-pointer">Mark as AI Film Teaser</label></div>
                          <Button className="w-full mt-2" disabled={uploading}>{uploading ? "Saving..." : (editingSampleId ? "Update Portfolio" : "Publish Portfolio")}</Button>
                          {editingSampleId && <Button variant="ghost" className="w-full text-xs" onClick={() => { setEditingSampleId(null); setTitle(""); }}>Cancel Edit</Button>}
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="md:col-span-8">
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between bg-secondary/10 pb-6 border-b border-border/30">
                        <div><CardTitle className="text-xl font-display font-bold">Active Portfolio</CardTitle><CardDescription>Manage shown images and videos.</CardDescription></div>
                        <div className="relative w-48"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" /><Input placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs bg-background border-border/50" /></div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <Tabs defaultValue="videos" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary/50 p-1 h-10">
                            <TabsTrigger value="videos" className="text-xs">AI Videos ({filteredSamples.filter(s => s.media_type === "video").length})</TabsTrigger>
                            <TabsTrigger value="images" className="text-xs">AI Images ({filteredSamples.filter(s => s.media_type === "image").length})</TabsTrigger>
                            <TabsTrigger value="teasers" className="text-xs">Film Teasers ({filteredSamples.filter(s => s.media_type === "teaser").length})</TabsTrigger>
                          </TabsList>
                          {["videos", "images", "teasers"].map(tab => (
                            <TabsContent key={tab} value={tab} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {filteredSamples.filter(s => tab === "videos" ? s.media_type === "video" : tab === "images" ? s.media_type === "image" : s.media_type === "teaser").map(s => (
                                <div key={s.id} className="relative group rounded-xl overflow-hidden border border-border/50 bg-black aspect-square">
                                  {s.media_type === "image" ? <img src={s.media_url} className="w-full h-full object-cover" /> : <video src={s.media_url} className="w-full h-full object-cover opacity-80" />}
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                                    <p className="text-[10px] font-bold text-white text-center mb-2 line-clamp-2">{s.title}</p>
                                    <div className="flex gap-2">
                                      <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => handleEditSample(s)}><Settings2 className="w-3.5 h-3.5" /></Button>
                                      <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => handleDeleteSample(s.id, s.media_url)}><Trash className="w-3.5 h-3.5" /></Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {filteredSamples.filter(s => tab === "videos" ? s.media_type === "video" : tab === "images" ? s.media_type === "image" : s.media_type === "teaser").length === 0 && (
                                <div className="col-span-full py-20 text-center bg-secondary/5 rounded-2xl border-2 border-dashed border-border/30"><p className="text-muted-foreground text-sm italic">No items found.</p></div>
                              )}
                            </TabsContent>
                          ))}
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* ── PROMPTS TAB ── */}
              <TabsContent value="prompts" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-4">
                    <Card className="shadow-sm">
                      <CardHeader><CardTitle className="text-xl font-display font-bold">Prompt Builder</CardTitle><CardDescription>Save creative AI prompts.</CardDescription></CardHeader>
                      <CardContent>
                        <form onSubmit={handleSavePrompt} className="space-y-4">
                          <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Title</label><Input placeholder="e.g. Cinematic Watch" value={promptForm.title} onChange={e => setPromptForm({...promptForm, title: e.target.value})} /></div>
                          <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Brand</label><Input placeholder="e.g. Rolex" value={promptForm.brand} onChange={e => setPromptForm({...promptForm, brand: e.target.value})} /></div>
                          <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Cover Preview</label><Input type="file" onChange={e => setPromptFile(e.target.files?.[0] || null)} className="bg-secondary/30" /></div>
                          <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Image Prompt</label><textarea className="w-full bg-secondary/30 border border-border p-3 rounded-lg text-sm min-h-[100px] outline-none focus:ring-1 focus:ring-gold/30" placeholder="Enter detailed prompt..." value={promptForm.image_prompt} onChange={e => setPromptForm({...promptForm, image_prompt: e.target.value})} /></div>
                          <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Video Prompt</label><textarea className="w-full bg-secondary/30 border border-border p-3 rounded-lg text-sm min-h-[100px] outline-none focus:ring-1 focus:ring-gold/30" placeholder="Enter video motion prompt..." value={promptForm.video_prompt} onChange={e => setPromptForm({...promptForm, video_prompt: e.target.value})} /></div>
                          <Button type="submit" className="w-full" disabled={uploading}>{uploading ? "Saving..." : (editingPromptId ? "Update Prompt" : "Save to Library")}</Button>
                          {editingPromptId && <Button variant="ghost" className="w-full text-xs" onClick={() => { setEditingPromptId(null); setPromptForm({ title: '', brand: '', image_prompt: '', negative_prompt: '', video_prompt: '', media_url: '', is_free: true }); }}>Cancel Edit</Button>}
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="md:col-span-8">
                    <Card className="shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-6">
                        <div><CardTitle className="text-xl font-display font-bold">Prompts Library</CardTitle><CardDescription>Your saved AI ad concepts.</CardDescription></div>
                        <div className="relative w-48"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" /><Input placeholder="Search library..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs bg-secondary/50 border-none" /></div>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead>Preview</TableHead><TableHead>Brand & Title</TableHead><TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredPrompts.map(p => (
                              <TableRow key={p.id} className="group">
                                <TableCell><div className="w-16 h-16 rounded-xl overflow-hidden border border-border/50 bg-secondary/20">{p.media_url ? <img src={p.media_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground uppercase font-bold italic px-2 text-center">No Preview</div>}</div></TableCell>
                                <TableCell><div className="text-sm font-bold">{p.title}</div><div className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.1em] mt-1">{p.brand}</div></TableCell>
                                <TableCell className="text-right"><div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditPrompt(p)}><Settings2 className="w-4 h-4 text-muted-foreground" /></Button><Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDeletePrompt(p.id)}><Trash className="w-4 h-4" /></Button></div></TableCell>
                              </TableRow>
                            ))}
                            {filteredPrompts.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-20 text-muted-foreground italic">No prompts found.</TableCell></TableRow>}
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
