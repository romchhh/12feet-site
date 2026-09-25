import HomePage from "@/components/HomePage";
import { cmsMenuAsColumns } from "@/lib/cms/store";
import { locales, type Locale, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** ISR: refresh CMS menu without full rebuild */
export const revalidate = 60;

export default async function LocaleHome({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const menuColumns = cmsMenuAsColumns();
  return <HomePage locale={locale} dict={dict} menuColumns={menuColumns} />;
}
