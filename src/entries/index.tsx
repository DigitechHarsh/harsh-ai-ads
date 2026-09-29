import { createRoot } from "react-dom/client";
import Index from "@/pages/Index";
import PageWrapper from "@/components/PageWrapper";

createRoot(document.getElementById("root")!).render(
  <PageWrapper>
    <Index />
  </PageWrapper>
);
