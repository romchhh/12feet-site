import AdminBodyClass from "@/components/admin/AdminBodyClass";
import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";
import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "12 FEET Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="feet-admin">
      <AdminBodyClass />
      <AdminAuthProvider>{children}</AdminAuthProvider>
    </div>
  );
}
