import type { MenuColumn } from "@/types";

type MenuLocale = "sk" | "en" | "ru" | "uk" | "de";

const teaHeading: Record<MenuLocale, string> = {
  sk: "Čaj sypaný",
  en: "Loose leaf tea",
  ru: "Чай рассыпной",
  uk: "Чай розсипний",
  de: "Loser Tee",
};

const teaItems: Record<MenuLocale, { name: string; price: string }[]> = {
  sk: [
    { name: "Zelený", price: "3,50 €" },
    { name: "Zelený s jasmínom", price: "3,50 €" },
    { name: "Čierny s citrónom", price: "3,50 €" },
    { name: "Mix ananas–granát", price: "3,50 €" },
  ],
  en: [
    { name: "Green", price: "€3.50" },
    { name: "Green with jasmine", price: "€3.50" },
    { name: "Black with lemon", price: "€3.50" },
    { name: "Pineapple–pomegranate blend", price: "€3.50" },
  ],
  ru: [
    { name: "Зелёный", price: "3,50 €" },
    { name: "Зелёный с жасмином", price: "3,50 €" },
    { name: "Чёрный с лимоном", price: "3,50 €" },
    { name: "Ассорти ананас–гранат", price: "3,50 €" },
  ],
  uk: [
    { name: "Зелений", price: "3,50 €" },
    { name: "Зелений з жасмином", price: "3,50 €" },
    { name: "Чорний з лимоном", price: "3,50 €" },
    { name: "Асорті ананас–гранат", price: "3,50 €" },
  ],
  de: [
    { name: "Grün", price: "3,50 €" },
    { name: "Grün mit Jasmin", price: "3,50 €" },
    { name: "Schwarz mit Zitrone", price: "3,50 €" },
    { name: "Ananas–Granatapfel-Mix", price: "3,50 €" },
  ],
};

const draftNote: Record<MenuLocale, string> = {
  sk: "V ponuke",
  en: "Selection available",
  ru: "В ассортименте",
  uk: "В асортименті",
  de: "Je nach Verfügbarkeit",
};

export function getMenuColumns(locale: MenuLocale): MenuColumn[] {
  const beer =
    locale === "ru"
      ? "Пиво бутылочное"
      : locale === "uk"
        ? "Пиво пляшкове"
        : locale === "sk"
          ? "Pivo fľaškové"
          : locale === "de"
            ? "Flaschenbier"
            : "Bottled beer";
  const draft =
    locale === "ru"
      ? "Пиво на разлив"
      : locale === "uk"
        ? "Пиво на розлив"
        : locale === "sk"
          ? "Pivo na čapovanie"
          : locale === "de"
            ? "Bier vom Fass"
            : "Draft beer";
  const coffee =
    locale === "ru"
      ? "Кофе"
      : locale === "uk"
        ? "Кава"
        : locale === "sk"
          ? "Káva"
          : locale === "de"
            ? "Kaffee"
            : "Coffee";
  const light =
    locale === "ru"
      ? "Светлое"
      : locale === "uk"
        ? "Світле"
        : locale === "sk"
          ? "Svetlé"
          : locale === "de"
            ? "Hell"
            : "Light";
  const dark =
    locale === "ru"
      ? "Тёмное"
      : locale === "uk"
        ? "Темне"
        : locale === "sk"
          ? "Tmavé"
          : locale === "de"
            ? "Dunkel"
            : "Dark";
  const ale =
    locale === "ru"
      ? "Эль"
      : locale === "uk"
        ? "Ель"
        : locale === "sk"
          ? "Ale"
          : locale === "de"
            ? "Ale"
            : "Ale";

  return [
    {
      heading: teaHeading[locale],
      items: teaItems[locale],
    },
    {
      heading: coffee,
      items: [
        { name: "Espresso", price: "1,50 €" },
        {
          name:
            locale === "ru" || locale === "uk"
              ? "Американо"
              : locale === "sk"
                ? "Americano"
                : "Americano",
          price: "2,00 €",
        },
        {
          name:
            locale === "ru"
              ? "Капучино"
              : locale === "uk"
                ? "Капучіно"
                : locale === "sk"
                  ? "Cappuccino"
                  : "Cappuccino",
          price: "2,50 €",
        },
      ],
    },
    {
      heading: beer,
      items: [
        {
          name:
            locale === "ru" || locale === "uk"
              ? "Корона"
              : locale === "sk"
                ? "Corona"
                : "Corona",
          price: "4,50 €",
        },
        {
          name:
            locale === "ru"
              ? "Капитан Джек"
              : locale === "uk"
                ? "Капітан Джек"
                : "Captain Jack",
          price: "3,50 €",
        },
        {
          name:
            locale === "ru"
              ? "Козел 12"
              : "Kozel 12",
          price: "1,50 €",
        },
        { name: "Zlatý bažan", price: "—" },
      ],
    },
    {
      heading: draft,
      items: [
        { name: light, price: "—" },
        { name: dark, price: "—" },
        { name: ale, price: "—" },
      ],
      note: draftNote[locale],
    },
  ];
}
