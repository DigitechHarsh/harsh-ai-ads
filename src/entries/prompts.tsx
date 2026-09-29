import { createRoot } from "react-dom/client";
import PromptsLibrary from "@/pages/PromptsLibrary";
import PageWrapper from "@/components/PageWrapper";

createRoot(document.getElementById("root")!).render(
  <PageWrapper>
    <PromptsLibrary />
  </PageWrapper>
);
