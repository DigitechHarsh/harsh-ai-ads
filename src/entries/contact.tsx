import { createRoot } from "react-dom/client";
import ContactUs from "@/pages/ContactUs";
import PageWrapper from "@/components/PageWrapper";

createRoot(document.getElementById("root")!).render(
  <PageWrapper>
    <ContactUs />
  </PageWrapper>
);
