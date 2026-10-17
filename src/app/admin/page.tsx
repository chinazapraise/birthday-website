import type { Metadata } from "next";
import ManageExperience from "@/components/manage/ManageExperience";
import AdminGate from "@/components/manage/AdminGate";

export const metadata: Metadata = {
  title: "Admin · 21",
  description: "Owner area for Chinaza's 21st birthday website.",
  robots: "noindex",
};

export default function AdminPage() {
  return (
    <AdminGate>
      <ManageExperience />
    </AdminGate>
  );
}
