import Link from "next/link";
import { defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default function NotFound() {
  const dict = getDictionary(defaultLocale);
  const t = dict.notFound;

  return (
    <main className="not-found-page">
      <div className="wrap">
        <h1>{t.title}</h1>
        <p>{t.text}</p>
        <Link className="btn green" href={`/${defaultLocale}`}>
          <span className="btn-label">{t.home}</span>
          <i aria-hidden="true">→</i>
        </Link>
      </div>
    </main>
  );
}
