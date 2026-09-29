import { createRoot } from "react-dom/client";
import NotFound from "@/pages/NotFound";
import PageWrapper from "@/components/PageWrapper";

createRoot(document.getElementById("root")!).render(
  <PageWrapper>
    <NotFound />
  </PageWrapper>
);
