import { createRoot } from "react-dom/client";
import AboutUs from "@/pages/AboutUs";
import PageWrapper from "@/components/PageWrapper";

createRoot(document.getElementById("root")!).render(
  <PageWrapper>
    <AboutUs />
  </PageWrapper>
);
