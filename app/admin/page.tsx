import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { Suspense } from "react";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
