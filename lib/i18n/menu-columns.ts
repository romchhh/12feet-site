import type { MenuColumn } from "@/types";

type MenuLocale = "sk" | "en" | "ru" | "uk" | "de";

const tea: Record<MenuLocale, string[]> = {
  sk: [
    "Zelený",
    "Zelený s jasmínom",
    "Čierny s citrónom",
    "Mix ananas–granát",
  ],
  en: [
    "Green",
    "Green with jasmine",
    "Black with lemon",
    "Pineapple–pomegranate blend",
  ],
  ru: [
    "Зелёный",
    "Зелёный с жасмином",
    "Чёрный с лимоном",
    "Ассорти ананас–гранат",
  ],
  uk: [
    "Зелений",
    "Зелений з жасмином",
    "Чорний з лимоном",
    "Асорті ананас–гранат",
  ],
  de: [
    "Grün",
    "Grün mit Jasmin",
    "Schwarz mit Zitrone",
    "Ananas–Granatapfel-Mix",
  ],
};

const teaHeading: Record<MenuLocale, string> = {
  sk: "Loose leaf tea · 3,50 €",
  en: "Loose leaf tea · €3.50",
  ru: "Чай рассыпной · 3,50 €",
  uk: "Чай розсипний · 3,50 €",
  de: "Loser Tee · 3,50 €",
};

const draftNote: Record<MenuLocale, string> = {
  sk: "V ponuke",
  en: "Selection available",
  ru: "В ассортименте",
  uk: "В асортименті",
  de: "Je nach Verfügbarkeit",
};

export function getMenuColumns(locale: MenuLocale): MenuColumn[] {
  const beer = locale === "ru" ? "Пиво бутылочное" : locale === "uk" ? "Пиво пляшкове" : locale === "sk" ? "Pivo fľaškové" : locale === "de" ? "Flaschenbier" : "Bottled beer";
  const draft = locale === "ru" ? "Пиво на разлив" : locale === "uk" ? "Пиво на розлив" : locale === "sk" ? "Pivo na čapovanie" : locale === "de" ? "Bier vom Fass" : "Draft beer";
  const coffee = locale === "ru" ? "Кофе" : locale === "uk" ? "Кава" : locale === "sk" ? "Káva" : locale === "de" ? "Kaffee" : "Coffee";
  const light = locale === "ru" ? "Светлое" : locale === "uk" ? "Світле" : locale === "sk" ? "Svetlé" : locale === "de" ? "Hell" : "Light";
  const dark = locale === "ru" ? "Тёмное" : locale === "uk" ? "Темне" : locale === "sk" ? "Tmavé" : locale === "de" ? "Dunkel" : "Dark";
  const ale = locale === "ru" ? "Эль" : locale === "uk" ? "Ель" : locale === "sk" ? "Ale" : locale === "de" ? "Ale" : "Ale";

  return [
    {
      heading: coffee,
      items: [
        { name: "Espresso", price: "1,50 €" },
        {
          name:
            locale === "ru"
              ? "Американо"
              : locale === "uk"
                ? "Американо"
                : locale === "sk"
                  ? "Americano"
                  : locale === "de"
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
      subheading: teaHeading[locale],
      subItems: tea[locale],
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
                : locale === "sk"
                  ? "Captain Jack"
                  : "Captain Jack",
          price: "3,50 €",
        },
        {
          name:
            locale === "ru"
              ? "Козел 12"
              : locale === "uk"
                ? "Kozel 12"
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
