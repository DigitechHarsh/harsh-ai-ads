import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/918160587315?text=Hi%2C%20I%20want%20a%20cinematic%20ad%20for%20my%20product"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[hsl(142,70%,45%)] text-[hsl(0,0%,100%)] px-5 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="w-5 h-5" />
    <span className="hidden sm:inline font-medium text-sm">Chat on WhatsApp</span>
  </a>
);

export default WhatsAppButton;
