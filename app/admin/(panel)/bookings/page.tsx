import BookingsView from "@/components/admin/views/BookingsView";
import { Suspense } from "react";

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<p>Загрузка…</p>}>
      <BookingsView />
    </Suspense>
  );
}
