import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What exactly is an AI Ad?",
    answer: "An AI Ad is a premium, high-quality video or 3D image created using advanced artificial intelligence. Instead of expensive physical photoshoots, we use AI to place your product in luxurious, dynamic, and hyper-realistic environments that stop the scroll and drive massive sales."
  },
  {
    question: "Do I need to send my physical product to you?",
    answer: "No! That's the magic of our process. You just need to send us clear, high-quality photos of your product taken from your smartphone. Our AI will extract the product and seamlessly integrate it into stunning 3D scenes."
  },
  {
    question: "How long does it take to get my ad?",
    answer: "Our standard turnaround time is incredibly fast: just 24 to 48 hours from the moment you submit your product photos and complete the initial process."
  },
  {
    question: "Is the ₹399 offer valid for videos or just images?",
    answer: "The ₹399 special offer covers a premium AI Image Ad. If you're looking for high-end video motion ads or Instagram reels, we will share customized pricing over WhatsApp based on your exact requirements."
  },
  {
    question: "What if I don't like the final result?",
    answer: "Client satisfaction is our top priority. We offer 1 round of free revisions to ensure the lighting, vibe, and branding perfectly align with your vision and expectations."
  },
  {
    question: "Will this work for any type of product?",
    answer: "Yes! Whether you sell skincare, jewelry, food items, electronics, or apparel, our AI can generate the perfect aesthetic environment tailored specifically to your niche and brand identity."
  },
  {
    question: "How do I make the payment?",
    answer: "Once you submit your details through our contact form, our team will instantly connect with you on WhatsApp with a secure Razorpay link where you can pay using UPI, Credit/Debit Card, or NetBanking."
  },
  {
    question: "I need multiple ads. Do you offer bulk packages?",
    answer: "Absolutely. If you need a complete social media overhaul with 5, 10, or 20 visual assets for a monthly campaign, we provide heavily discounted retainer packages. Drop a message on our WhatsApp to discuss bulk pricing."
  }
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-12 md:py-16 px-4 bg-secondary/10">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Frequently Asked <span className="text-gold-gradient">Questions</span>
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about our AI production process.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border px-6 py-2 rounded-xl"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-gold transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
