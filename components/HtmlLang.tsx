"use client";

import { htmlLang, type Locale } from "@/lib/i18n/config";
import { useEffect } from "react";

type Props = { locale: Locale };

export default function HtmlLang({ locale }: Props) {
  useEffect(() => {
    document.documentElement.lang = htmlLang[locale];
  }, [locale]);
  return null;
}
