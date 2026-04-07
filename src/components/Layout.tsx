import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin") || location.pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </div>
  );
};

export default Layout;
