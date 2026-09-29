import { createRoot } from "react-dom/client";
import Portfolio from "@/pages/Portfolio";
import PageWrapper from "@/components/PageWrapper";

createRoot(document.getElementById("root")!).render(
  <PageWrapper>
    <Portfolio />
  </PageWrapper>
);
