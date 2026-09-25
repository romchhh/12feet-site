"use client";

import { useEffect } from "react";

export default function AdminBodyClass() {
  useEffect(() => {
    document.body.classList.add("feet-admin");
    return () => {
      document.body.classList.remove("feet-admin");
    };
  }, []);
  return null;
}
