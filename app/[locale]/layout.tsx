import { htmlLang, locales, type Locale, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { siteUrl } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const url = `${siteUrl}/${locale}`;

  const languages = Object.fromEntries(
    locales.map((l) => [htmlLang[l], `${siteUrl}/${l}`]),
  );

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": `${siteUrl}/sk` },
    },
    openGraph: {
      title: dict.meta.ogTitle,
      description: dict.meta.description,
      url,
      siteName: "12 FEET",
      locale: htmlLang[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.ogTitle,
      description: dict.meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <>{children}</>;
}
