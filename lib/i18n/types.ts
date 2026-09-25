import type { MenuColumn } from "@/types";

export type Dictionary = {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
  };
  nav: {
    aria: string;
    tables: string;
    prices: string;
    menu: string;
    visit: string;
    book: string;
    openMenu: string;
    closeMenu: string;
    menuDialog: string;
  };
  hero: {
    pre: string;
    title: string;
    post: string;
    lead: string;
    cta: string;
  };
  stats: {
    aria: string;
    items: { value: string; label: string }[];
  };
  cta: {
    title: string;
    text: string;
    button: string;
  };
  about: {
    titleSans: string;
    titleSerif: string;
    lead: string;
    extra: string;
    addressKicker: string;
    addressTitle: string;
    addressText: string;
    hoursKicker: string;
    hoursTitle: string;
    hoursText: string;
    bookKicker: string;
    bookTitle: string;
    bookLink: string;
  };
  experience: {
    titleSans: string;
    titleSerif: string;
    lead: string;
    items: { title: string; text: string }[];
  };
  tables: {
    titleSans: string;
    titleSerif: string;
    lead: string;
    note: string;
    specs: { title: string; text: string }[];
    weekdayTitle: string;
    weekdaySub: string;
    weekendTitle: string;
    weekendSub: string;
    perHour: string;
  };
  menu: {
    titleSans: string;
    titleSerif: string;
    lead: string;
    columns: MenuColumn[];
  };
  how: {
    titleSans: string;
    titleSerif: string;
    lead: string;
    steps: { title: string; text: string }[];
  };
  faq: {
    titleSans: string;
    titleSerif: string;
    lead?: string;
    items: { q: string; a: string }[];
  };
  visit: {
    titleSans: string;
    titleSerif: string;
    lead: string;
    bullets: string[];
    mapLabel: string;
  };
  book: {
    titleSans: string;
    titleSerif: string;
    lead: string;
    date: string;
    time: string;
    table: string;
    hours: string;
    name: string;
    namePh: string;
    phone: string;
    phonePh: string;
    previewEmpty: string;
    total: string;
    submit: string;
    table1: string;
    table2: string;
    perHour: string;
    hourUnit: string;
    hoursUnit: string;
    hoursUnitMany: string;
    done: string;
    submitting: string;
    submitError: string;
  };
  footer: {
    logo: string;
    address: string;
    hours: string;
    book: string;
    tag: string;
  };
  notFound: {
    title: string;
    text: string;
    home: string;
  };
};

export type DictionaryBase = Omit<
  Dictionary,
  "stats" | "cta" | "about" | "tables"
> & {
  about: Omit<Dictionary["about"], "extra">;
  tables: Omit<Dictionary["tables"], "note" | "specs">;
};
