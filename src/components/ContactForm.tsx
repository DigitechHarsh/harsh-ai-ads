import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Image as ImageIcon, X, Plus, Mail, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";


const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    phone: "",
    email: "",
    productType: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (selectedFiles.length + filesArray.length > 5) {
        toast({ title: "Maximum 5 images allowed", variant: "destructive" });
        return;
      }
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // 1. Upload Images to Cloudinary
      const uploadedImageUrls: string[] = [];
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      for (const file of selectedFiles) {
        if (!cloudName || !uploadPreset) {
          throw new Error("Cloudinary credentials are not set in .env");
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to upload ${file.name}: ${errorText}`);
        }

        const data = await res.json();
        uploadedImageUrls.push(data.secure_url);
      }

      // 2. Submit Lead to Database via Backend API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          brand_name: formData.brandName || null,
          phone: formData.phone,
          email: formData.email,
          product_type: formData.productType || null,
          product_images: uploadedImageUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setIsEligible(data.isEligible ?? true);
      setSubmitted(true);
      
      // 3. Meta Pixel Lead Tracking
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: '₹399 AI Ad Offer',
          status: data.isEligible ? 'eligible' : 'standard'
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({ title: "Something went wrong. Please try WhatsApp.", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 transition-shadow text-base";

  if (submitted) {
    return (
      <section id="form" className="py-12 md:py-16 px-4">
        <div className="container max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-12"
          >
            <CheckCircle className="w-16 h-16 text-primary mx-auto" />
            
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              You are eligible for the ₹399 offer 🎉
            </h2>
            <p className="text-muted-foreground text-lg">
              Congratulations! Our team will contact you shortly to start your project.
            </p>

            <p className="text-muted-foreground text-sm mt-4">
              Check your email for a confirmation message.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="form" className="py-12 md:py-16 px-4 bg-secondary/10">
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Contact Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Let's Build Your <span className="text-gold-gradient">Next Masterpiece</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Fill details & upload product images to get your premium AI ad. Or reach out to us directly below.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border/50 group hover:border-gold/30 transition-all duration-300">
                <div className="p-3 rounded-lg bg-gold/10 text-gold group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Us</p>
                  <a href="mailto:aicreationsbyharsh@gmail.com" className="text-foreground transition-colors font-semibold hover:text-gold">aicreationsbyharsh@gmail.com</a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border/50 group hover:border-gold/30 transition-all duration-300">
                <div className="p-3 rounded-lg bg-gold/10 text-gold group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">WhatsApp</p>
                  <a href="https://wa.me/918160587315" className="text-foreground transition-colors font-semibold hover:text-gold">+91 81605 87315</a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background p-6 md:p-8 rounded-2xl border border-border/50 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              required
              maxLength={100}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="brandName"
                placeholder="Brand Name"
                value={formData.brandName}
                onChange={handleChange}
                className={inputClass}
                maxLength={100}
              />
              <input
                name="productType"
                placeholder="Product Type (e.g. Skin)"
                value={formData.productType}
                onChange={handleChange}
                className={inputClass}
                maxLength={100}
              />
            </div>
            <input
              name="phone"
              placeholder="WhatsApp Number *"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
              required
              maxLength={15}
              type="tel"
            />
            <input
              name="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              required
              maxLength={255}
              type="email"
            />

            {/* Image Upload Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground block">
                Product Images (Max 5)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                {selectedFiles.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center hover:border-gold/50 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground mt-1">Add</span>
                  </button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-gradient text-primary-foreground font-bold py-4 rounded-lg text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
            >
              {loading ? "Uploading Images..." : <><Send className="w-5 h-5" /> Get My AI Ad</>}
            </button>
          </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
