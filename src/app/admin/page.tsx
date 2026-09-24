import type { Metadata } from "next";
import ManageExperience from "@/components/manage/ManageExperience";
import AdminGate from "@/components/manage/AdminGate";

export const metadata: Metadata = {
  title: "Admin · 27",
  description: "Owner area for 27: The Story So Far.",
  robots: "noindex",
};

export default function AdminPage() {
  return (
    <AdminGate>
      <ManageExperience />
    </AdminGate>
  );
}