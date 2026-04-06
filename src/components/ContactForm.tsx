import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Image as ImageIcon, X, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      // 1. Upload Images to Supabase Storage
      const uploadedImageUrls: string[] = [];
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-submissions")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from("product-submissions")
          .getPublicUrl(filePath);
        
        uploadedImageUrls.push(publicUrl);
      }

      // 2. Submit Lead to Database
      const { data, error } = await supabase.rpc("submit_lead_with_offer_v2", {
        p_name: formData.name,
        p_brand_name: formData.brandName || null,
        p_phone: formData.phone,
        p_email: formData.email,
        p_product_type: formData.productType || null,
        p_product_images: uploadedImageUrls, // New field for images
      });

      // FALLBACK: If RPC wasn't updated yet, try regular insert
      if (error && error.message.includes("does not exist")) {
        const { data: insertData, error: insertError } = await supabase.from("contact_submissions").insert({
          name: formData.name,
          brand_name: formData.brandName || null,
          phone: formData.phone,
          email: formData.email,
          product_type: formData.productType || null,
          product_images: uploadedImageUrls,
        });
        if (insertError) throw insertError;
      } else if (error) {
        throw new Error(error.message);
      }

      setIsEligible(data ?? true);

      // 3. Trigger the welcome email via Supabase Edge Functions
      await supabase.functions.invoke("send-email", {
        body: {
          email: formData.email,
          name: formData.name,
          isEligible: data ?? true,
        },
      });

      setSubmitted(true);
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
      <section id="form" className="py-20 px-4">
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
    <section id="form" className="py-20 px-4">
      <div className="container max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-display font-bold text-center mb-2">
            Get <span className="text-gold-gradient">Started</span>
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Fill details & upload product images (max 5)
          </p>

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
              {loading ? "Uploading Images..." : <><Send className="w-5 h-5" /> Get My Cinematic Ad</>}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
