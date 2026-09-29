import { createRoot } from "react-dom/client";
import Login from "@/pages/Login";
import PageWrapper from "@/components/PageWrapper";

createRoot(document.getElementById("root")!).render(
  <PageWrapper>
    <Login />
  </PageWrapper>
);
