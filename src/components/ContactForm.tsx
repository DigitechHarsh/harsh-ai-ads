import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("submit_lead_with_offer", {
        p_name: formData.name,
        p_brand_name: formData.brandName || null,
        p_phone: formData.phone,
        p_email: formData.email,
        p_product_type: formData.productType || null,
      });

      if (error) {
        throw new Error(error.message);
      }

      setIsEligible(data); // data is boolean representing eligibility

      // Trigger the welcome email via Supabase Edge Functions
      await supabase.functions.invoke("send-email", {
        body: {
          email: formData.email,
          name: formData.name,
          isEligible: data,
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
            
            {isEligible ? (
              <>
                <h2 className="text-2xl md:text-3xl font-display font-bold">
                  You are eligible for the ₹299 offer 🎉
                </h2>
                <p className="text-muted-foreground text-lg">
                  Congratulations! Our team will contact you shortly to start your project.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-display font-bold">
                  Offer slots are full.
                </h2>
                <p className="text-muted-foreground text-lg">
                  But don't worry! Our team will contact you with our current best pricing within 24 hours.
                </p>
              </>
            )}

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
            Fill in your details and we'll create your cinematic ad
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
            <input
              name="brandName"
              placeholder="Brand Name"
              value={formData.brandName}
              onChange={handleChange}
              className={inputClass}
              maxLength={100}
            />
            <input
              name="phone"
              placeholder="Phone Number *"
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
            <input
              name="productType"
              placeholder="Product Type (e.g. Skincare, Clothing, Gadgets)"
              value={formData.productType}
              onChange={handleChange}
              className={inputClass}
              maxLength={100}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-gradient text-primary-foreground font-bold py-4 rounded-lg text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              <Send className="w-5 h-5" />
              {loading ? "Submitting..." : "Get My Cinematic Ad"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
