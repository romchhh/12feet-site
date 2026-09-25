"use client";

import { useEffect } from "react";

export default function AdminBodyClass() {
  useEffect(() => {
    const prevLang = document.documentElement.lang;
    document.body.classList.add("feet-admin");
    document.documentElement.lang = "ru";
    return () => {
      document.body.classList.remove("feet-admin");
      document.documentElement.lang = prevLang;
    };
  }, []);
  return null;
}
