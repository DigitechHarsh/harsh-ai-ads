import { createRoot } from "react-dom/client";
import AdminDashboard from "@/pages/AdminDashboard";
import PageWrapper from "@/components/PageWrapper";

createRoot(document.getElementById("root")!).render(
  <PageWrapper>
    <AdminDashboard />
  </PageWrapper>
);
