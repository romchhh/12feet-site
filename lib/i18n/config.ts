export const locales = ["sk", "en", "ru", "uk", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sk";

export const localeLabels: Record<Locale, string> = {
  sk: "Slovenčina",
  en: "English",
  ru: "Русский",
  uk: "Українська",
  de: "Deutsch",
};

export const htmlLang: Record<Locale, string> = {
  sk: "sk",
  en: "en",
  ru: "ru",
  uk: "uk",
  de: "de",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
