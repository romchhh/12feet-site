import AnalyticsBeacon from "@/components/AnalyticsBeacon";
import Booking from "@/components/Booking";
import ClubIntro from "@/components/ClubIntro";
import CtaBand from "@/components/CtaBand";
import Experience from "@/components/Experience";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import HtmlLang from "@/components/HtmlLang";
import JsonLd from "@/components/JsonLd";
import Menu from "@/components/Menu";
import StatsStrip from "@/components/StatsStrip";
import Tables from "@/components/Tables";
import Visit from "@/components/Visit";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import type { MenuColumn } from "@/types";

type Props = {
  locale: Locale;
  dict: Dictionary;
  menuColumns?: MenuColumn[];
};

export default function HomePage({ locale, dict, menuColumns }: Props) {
  return (
    <>
      <AnalyticsBeacon locale={locale} />
      <HtmlLang locale={locale} />
      <JsonLd dict={dict} locale={locale} />
      <Hero locale={locale} dict={dict} />
      <main className="site-shell">
        <ClubIntro dict={dict} />
        <StatsStrip dict={dict} />
        <Experience dict={dict} />
        <Tables dict={dict} />
        <Menu dict={dict} menuColumns={menuColumns} />
        <HowItWorks dict={dict} />
        <Visit dict={dict} />
        <CtaBand dict={dict} />
        <Booking locale={locale} dict={dict} />
        <Faq dict={dict} />
      </main>
      <Footer dict={dict} locale={locale} />
    </>
  );
}
