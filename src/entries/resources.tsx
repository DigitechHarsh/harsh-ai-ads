import { createRoot } from "react-dom/client";
import Resources from "@/pages/Resources";
import PageWrapper from "@/components/PageWrapper";

createRoot(document.getElementById("root")!).render(
  <PageWrapper>
    <Resources />
  </PageWrapper>
);
