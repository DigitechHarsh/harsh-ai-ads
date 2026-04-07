import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import OfferMarquee from "./OfferMarquee";
import OfferCountdownBar from "./OfferCountdownBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin") || location.pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {!isAdmin && (
        <header className="fixed top-0 left-0 right-0 z-[70]">
          <Navbar />
          <OfferCountdownBar />
          <OfferMarquee />
        </header>
      )}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </div>
  );
};

export default Layout;
