import HeroNav from "@/components/HeroNav";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import Image from "next/image";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export default function Hero({ locale, dict }: Props) {
  const t = dict.hero;
  return (
    <section className="hero" id="top">
      <div className="hero-media" aria-hidden="true">
        <Image
          src="/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGjP//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEABj8Cf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8hf//Z"
        />
      </div>
      <HeroNav locale={locale} dict={dict} />

      <div className="br tl" aria-hidden="true">
        <svg viewBox="0 0 48 48" strokeLinejoin="round">
          <path d="M24 6 42 40H6Z" />
          <circle cx="24" cy="30" r="3" />
        </svg>
      </div>
      <div className="br brt" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="17" />
          <circle cx="24" cy="24" r="7" />
        </svg>
      </div>

      <div className="hero-body">
        <div className="hero-copy">
          <div className="pre">{t.pre}</div>
          <div className="big">{t.title}</div>
          <div className="post">{t.post}</div>
          <p className="lead">{t.lead}</p>
          <a href="#book" className="btn gold">
            <span className="btn-label">{t.cta}</span>
            <i aria-hidden="true">→</i>
          </a>
        </div>
      </div>
    </section>
  );
}
