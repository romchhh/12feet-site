import type { Locale } from "@/lib/i18n/config";
import { getMenuColumns } from "@/lib/i18n/menu-columns";
import type { Dictionary, DictionaryBase } from "@/lib/i18n/types";

const shared = {
  address: "Záhradnícka 36, Bratislava",
  hoursShort: "Tue–Thu 12:00–00:00 · Fri–Sun 12:00–02:00",
};

const dictionaries: Record<Locale, DictionaryBase> = {
  sk: {
    meta: {
      title: "12 FEET — Biliardový klub & Gentlemen's lounge, Bratislava",
      description:
        "Dva 12-stopové stoly pre pyramídu, bar a rezervácia online. Záhradnícka 36, Bratislava.",
      ogTitle: "12 FEET Biliard · Bratislava",
    },
    nav: {
      aria: "Hlavná navigácia",
      tables: "Stoly",
      prices: "Ceny",
      menu: "Menu",
      visit: "Kontakt",
      book: "Rezervovať",
      openMenu: "Otvoriť menu",
      closeMenu: "Zavrieť menu",
      menuDialog: "Menu",
    },
    hero: {
      pre: "Billiard club",
      title: "12 FEET",
      post: "Gentlemen's lounge",
      lead: "Pyramída · dva 12-stopové stoly · " + shared.address,
      cta: "Rezervovať stôl",
    },
    about: {
      titleSans: "o klube",
      titleSerif: "12 FEET",
      lead: "Billiard club & Gentlemen's lounge v centre Bratislavy",
      addressKicker: "Adresa",
      addressTitle: "Záhradnícka 36",
      addressText: "Bratislava",
      hoursKicker: "Otváracie hodiny",
      hoursTitle: "12:00 – 00:00",
      hoursText: "Ut – Št do polnoci · Pi – Ne do 02:00",
      bookKicker: "Rezervácia",
      bookTitle: "Cez web",
      bookLink: "Rezervovať stôl →",
    },
    experience: {
      titleSans: "prečo",
      titleSerif: "12 FEET",
      lead: "Klub pre pokojnú hru, dobrý bar a spoločnosť.",
      items: [
        {
          title: "Pyramída na 12 ft",
          text: "Dva profi stoly v plnej veľkosti — ruská pyramída, kvalitné plátno a svetlo.",
        },
        {
          title: "Bar pri stole",
          text: "Káva, čaj a pivo — objednáte pri hre, bez zbytočného behania.",
        },
        {
          title: "Gentlemen's lounge",
          text: "Tlmivé svetlo, pohodlné posedenie a pokojná atmosféra v centre mesta.",
        },
        {
          title: "Rezervácia online",
          text: "Dátum, čas a stôl 1 alebo 2 — cena sa počíta automaticky.",
        },
      ],
    },
    tables: {
      titleSans: "stoly",
      titleSerif: "Pyramída",
      lead: "Dva 12-stopové biliardové stoly pre ruskú pyramídu — plná veľkosť a pokojný zál.",
      weekdayTitle: "Všedné dni",
      weekdaySub: "Pondelok – štvrtok",
      weekendTitle: "Víkend",
      weekendSub: "Piatok – nedeľa",
      perHour: "€ / hod",
    },
    menu: {
      titleSans: "bar",
      titleSerif: "Menu",
      lead: "Káva, čaj a pivo — to, čo si ľudia objednávajú pri stole.",
      columns: getMenuColumns("sk"),
    },
    how: {
      titleSans: "tri",
      titleSerif: "kroky k stolu",
      lead: "Od výberu času po potvrdenie — rezervácia trvá minútu.",
      steps: [
        {
          title: "Vyberte moment",
          text: "Od 12:00. Do polnoci vo všedné dni, do 02:00 cez víkend.",
        },
        {
          title: "Zvoľte stôl",
          text: "Dva 12 ft stoly, 1–6 hodín. 20 € Po–Št · 25 € Pi–Ne.",
        },
        {
          title: "Pošlite a hrajte",
          text: "Formulár online — potvrdíme rezerváciu a pripravíme stôl.",
        },
      ],
    },
    faq: {
      titleSans: "pred",
      titleSerif: "partiou",
      items: [
        {
          q: "Koľko stolov máte?",
          a: "Dva plné 12 ft stoly — dve partie naraz, alebo celý zál pre partiu priateľov.",
        },
        {
          q: "Koľko stojí hodina?",
          a: "20 € Po–Št, 25 € Pi–Ne. Spolu sa počíta automaticky vo formulári.",
        },
        {
          q: "Treba rezervovať vopred?",
          a: "Áno, hlavne večer a cez víkend — online za minútu, bez telefonovania.",
        },
        {
          q: "Kde vás nájdeme?",
          a: shared.address + " — centrum Bratislavy, pár minút od MHD.",
        },
      ],
    },
    visit: {
      titleSans: "nájdete",
      titleSerif: "nás",
      lead: "Príďte priamo do klubu alebo si najprv rezervujte stôl online.",
      bullets: [
        shared.address,
        "Ut – Št 12:00 – 00:00",
        "Pi – Ne 12:00 – 02:00",
        "Rezervácia cez formulár na tejto stránke",
      ],
      mapLabel: "Otvoriť v Mapách",
    },
    book: {
      titleSans: "rezervujte",
      titleSerif: "stôl",
      lead: "20 €/hod všedný deň, 25 €/hod piatok – nedeľa. Dva stoly na výber.",
      date: "Dátum",
      time: "Čas",
      table: "Stôl",
      hours: "Hodín",
      name: "Meno",
      namePh: "Vaše meno",
      phone: "Telefón",
      phonePh: "+421 …",
      previewEmpty: "Zvoľte dátum a čas",
      total: "Spolu",
      submit: "Rezervovať",
      table1: "Stôl 1",
      table2: "Stôl 2",
      perHour: "€/hod",
      hourUnit: "hod",
      hoursUnit: "hod",
      hoursUnitMany: "hod",
      done: "Ďakujeme — potvrdíme rezerváciu na",
      submitting: "Odosielam…",
      submitError:
        "Nepodarilo sa odoslať. Skúste znova alebo zavolajte do klubu.",
    },
    footer: {
      logo: "12 FEET",
      address: shared.address,
      hours: "Ut – Št 12:00 – 00:00 · Pi – Ne 12:00 – 02:00",
      book: "Rezervovať stôl",
      tag: "Billiard club & Gentlemen's lounge",
    },
    notFound: {
      title: "Stránka nenájdená",
      text: "Skontrolujte adresu alebo prejdite na hlavnú stránku.",
      home: "Domov",
    },
  },

  en: {
    meta: {
      title: "12 FEET — Billiard Club & Gentlemen's Lounge, Bratislava",
      description:
        "Two 12-foot pyramid tables, bar menu, online booking. Záhradnícka 36, Bratislava.",
      ogTitle: "12 FEET Billiard · Bratislava",
    },
    nav: {
      aria: "Main navigation",
      tables: "Tables",
      prices: "Prices",
      menu: "Menu",
      visit: "Contact",
      book: "Book",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      menuDialog: "Menu",
    },
    hero: {
      pre: "Billiard club",
      title: "12 FEET",
      post: "Gentlemen's lounge",
      lead: "Pyramid · two 12-foot tables · " + shared.address,
      cta: "Book a table",
    },
    about: {
      titleSans: "about",
      titleSerif: "12 FEET",
      lead: "Billiard club & Gentlemen's lounge in central Bratislava",
      addressKicker: "Address",
      addressTitle: "Záhradnícka 36",
      addressText: "Bratislava",
      hoursKicker: "Opening hours",
      hoursTitle: "12:00 – 00:00",
      hoursText: "Tue – Thu until midnight · Fri – Sun until 02:00",
      bookKicker: "Booking",
      bookTitle: "Online",
      bookLink: "Book a table →",
    },
    experience: {
      titleSans: "why",
      titleSerif: "12 FEET",
      lead: "A club for unhurried play, a good bar, and company.",
      items: [
        {
          title: "12 ft pyramid",
          text: "Two full-size pro tables — Russian pyramid, quality cloth and lighting.",
        },
        {
          title: "Bar at the table",
          text: "Coffee, tea and beer — order while you play.",
        },
        {
          title: "Gentlemen's lounge",
          text: "Soft light, comfortable seating, calm atmosphere downtown.",
        },
        {
          title: "Online booking",
          text: "Pick date, time and table 1 or 2 — price updates instantly.",
        },
      ],
    },
    tables: {
      titleSans: "tables",
      titleSerif: "Pyramid",
      lead: "Two 12-foot tables for Russian pyramid — full size, calm room.",
      weekdayTitle: "Weekdays",
      weekdaySub: "Monday – Thursday",
      weekendTitle: "Weekend",
      weekendSub: "Friday – Sunday",
      perHour: "€ / hour",
    },
    menu: {
      titleSans: "bar",
      titleSerif: "Menu",
      lead: "Coffee, tea and beer — what guests order at the table.",
      columns: getMenuColumns("en"),
    },
    how: {
      titleSans: "three",
      titleSerif: "steps to play",
      lead: "From time slot to confirmation — booking takes a minute.",
      steps: [
        {
          title: "Pick your moment",
          text: "From 12:00. Until midnight on weekdays, 02:00 on weekends.",
        },
        {
          title: "Choose a table",
          text: "Two 12 ft tables, 1–6 hours. €20 Mon–Thu · €25 Fri–Sun.",
        },
        {
          title: "Send & play",
          text: "Submit online — we confirm and set the table for you.",
        },
      ],
    },
    faq: {
      titleSans: "before",
      titleSerif: "you play",
      items: [
        {
          q: "How many tables?",
          a: "Two full 12 ft tables — two games at once, or the room for a group.",
        },
        {
          q: "What’s the hourly rate?",
          a: "€20 Mon–Thu, €25 Fri–Sun. The form totals it automatically.",
        },
        {
          q: "Do I need to book ahead?",
          a: "Yes for evenings and weekends — online in a minute, no phone tag.",
        },
        {
          q: "Where do we find you?",
          a: shared.address + " — central Bratislava, near public transport.",
        },
      ],
    },
    visit: {
      titleSans: "find",
      titleSerif: "us",
      lead: "Walk in or book a table online first.",
      bullets: [
        shared.address,
        "Tue – Thu 12:00 – 00:00",
        "Fri – Sun 12:00 – 02:00",
        "Booking via the form on this page",
      ],
      mapLabel: "Open in Maps",
    },
    book: {
      titleSans: "book a",
      titleSerif: "table",
      lead: "€20/h on weekdays, €25/h Fri–Sun. Two tables available.",
      date: "Date",
      time: "Time",
      table: "Table",
      hours: "Hours",
      name: "Name",
      namePh: "Your name",
      phone: "Phone",
      phonePh: "+421 …",
      previewEmpty: "Choose date and time",
      total: "Total",
      submit: "Book now",
      table1: "Table 1",
      table2: "Table 2",
      perHour: "€/h",
      hourUnit: "hr",
      hoursUnit: "hrs",
      hoursUnitMany: "hrs",
      done: "Thanks — we will confirm your booking for",
      submitting: "Sending…",
      submitError: "Could not send. Please try again or call the club.",
    },
    footer: {
      logo: "12 FEET",
      address: shared.address,
      hours: shared.hoursShort,
      book: "Book a table",
      tag: "Billiard club & Gentlemen's lounge",
    },
    notFound: {
      title: "Page not found",
      text: "Check the URL or go to the homepage.",
      home: "Home",
    },
  },

  ru: {
    meta: {
      title: "12 FEET — Бильярдный клуб & Gentlemen's lounge, Братислава",
      description:
        "Два 12-футовых стола для пирамиды, меню бара, бронирование онлайн. Záhradnícka 36.",
      ogTitle: "12 FEET · Бильярд Братислава",
    },
    nav: {
      aria: "Главная навигация",
      tables: "Столы",
      prices: "Цены",
      menu: "Меню",
      visit: "Контакты",
      book: "Забронировать",
      openMenu: "Открыть меню",
      closeMenu: "Закрыть меню",
      menuDialog: "Меню",
    },
    hero: {
      pre: "Billiard club",
      title: "12 FEET",
      post: "Gentlemen's lounge",
      lead: "Пирамида · два 12-футовых стола · " + shared.address,
      cta: "Забронировать стол",
    },
    about: {
      titleSans: "о клубе",
      titleSerif: "12 FEET",
      lead: "Billiard club & Gentlemen's lounge в центре Бratislavy",
      addressKicker: "Адрес",
      addressTitle: "Záhradnícka 36",
      addressText: "Bratislava",
      hoursKicker: "Часы работы",
      hoursTitle: "12:00 – 00:00",
      hoursText: "Вт – Чт до полуночи · Пт – Вс до 02:00",
      bookKicker: "Бронь",
      bookTitle: "На сайте",
      bookLink: "Забронировать стол →",
    },
    experience: {
      titleSans: "почему",
      titleSerif: "12 FEET",
      lead: "Клуб для спокойной игры, хорошего бара и приятной компании.",
      items: [
        {
          title: "Пирамида 12 ft",
          text: "Два профессиональных стола — русская пирамида, сукно и свет.",
        },
        {
          title: "Бар у стола",
          text: "Кофе, чай и пivo — заказываете во время партии.",
        },
        {
          title: "Gentlemen's lounge",
          text: "Мягкий свет, удобные места, спокойная атмосфера в центре.",
        },
        {
          title: "Бронь онлайн",
          text: "Дата, время, стол 1 или 2 — цена считается сразу.",
        },
      ],
    },
    tables: {
      titleSans: "столы",
      titleSerif: "Пирамида",
      lead: "Два 12-футовых стола для русской пирамиды — полный размер, тихий зал.",
      weekdayTitle: "Будни",
      weekdaySub: "Понедельник – четверг",
      weekendTitle: "Выходные",
      weekendSub: "Пятница – воскресенье",
      perHour: "€ / час",
    },
    menu: {
      titleSans: "бар",
      titleSerif: "Меню",
      lead: "Кофе, чай и пivo — всё, что заказывают за столом.",
      columns: getMenuColumns("ru"),
    },
    how: {
      titleSans: "три",
      titleSerif: "шага к столу",
      lead: "От выбора времени до подтверждения — бронь за минуту.",
      steps: [
        {
          title: "Выберите момент",
          text: "С 12:00. До полуночи в будни, до 02:00 в выходные.",
        },
        {
          title: "Выберите стол",
          text: "Два стола 12 ft, 1–6 часов. 20 € Пн–Чт · 25 € Пт–Вс.",
        },
        {
          title: "Отправьте и играйте",
          text: "Форма онлайн — подтвердим бронь и подготовим стол.",
        },
      ],
    },
    faq: {
      titleSans: "перед",
      titleSerif: "партией",
      items: [
        {
          q: "Сколько столов?",
          a: "Два полных стола 12 ft — две партии сразу или зал для компании.",
        },
        {
          q: "Сколько стоит час?",
          a: "20 € Пн–Чт, 25 € Пт–Вс. Сумма считается в форме автоматически.",
        },
        {
          q: "Нужна ли бронь заранее?",
          a: "Да, особенно вечером и в выходные — онлайн за минуту, без звонков.",
        },
        {
          q: "Где вас найти?",
          a: shared.address + " — центр Братиславы, рядом с транспортом.",
        },
      ],
    },
    visit: {
      titleSans: "как",
      titleSerif: "нас найти",
      lead: "Приходите в клуб или сначала забронируйте стол онлайн.",
      bullets: [
        shared.address,
        "Вт – Чт 12:00 – 00:00",
        "Пт – Вс 12:00 – 02:00",
        "Бронь через форму на этой странице",
      ],
      mapLabel: "Открыть в картах",
    },
    book: {
      titleSans: "забронируйте",
      titleSerif: "стол",
      lead: "20 €/час в будни, 25 €/час с пятницы по воскресенье.",
      date: "Дата",
      time: "Время",
      table: "Стол",
      hours: "Часов",
      name: "Имя",
      namePh: "Ваше имя",
      phone: "Телефон",
      phonePh: "+421 …",
      previewEmpty: "Укажите дату и время",
      total: "Итого",
      submit: "Забронировать",
      table1: "Стол 1",
      table2: "Стол 2",
      perHour: "€/час",
      hourUnit: "час",
      hoursUnit: "часа",
      hoursUnitMany: "часов",
      done: "Спасибо — подтвердим бронь на",
      submitting: "Отправка…",
      submitError:
        "Не удалось отправить. Попробуйте снова или позвоните в клуб.",
    },
    footer: {
      logo: "12 FEET",
      address: shared.address,
      hours: "Вт – Чт 12:00 – 00:00 · Пт – Вс 12:00 – 02:00",
      book: "Забронировать стол",
      tag: "Billiard club & Gentlemen's lounge",
    },
    notFound: {
      title: "Страница не найдена",
      text: "Проверьте адрес или перейдите на главную.",
      home: "Главная",
    },
  },

  uk: {
    meta: {
      title: "12 FEET — Більярдний клуб & Gentlemen's lounge, Братислава",
      description:
        "Два 12-футових столи для піраміди, меню бару, бронювання онлайн. Záhradnícka 36.",
      ogTitle: "12 FEET · Більярд Братислава",
    },
    nav: {
      aria: "Головна навігація",
      tables: "Столи",
      prices: "Ціни",
      menu: "Меню",
      visit: "Контакти",
      book: "Забронювати",
      openMenu: "Відкрити меню",
      closeMenu: "Закрити меню",
      menuDialog: "Меню",
    },
    hero: {
      pre: "Billiard club",
      title: "12 FEET",
      post: "Gentlemen's lounge",
      lead: "Піраміда · два 12-футових столи · " + shared.address,
      cta: "Забронювати стіл",
    },
    about: {
      titleSans: "про клуб",
      titleSerif: "12 FEET",
      lead: "Billiard club & Gentlemen's lounge у центрі Братislavy",
      addressKicker: "Адреса",
      addressTitle: "Záhradnícka 36",
      addressText: "Bratislava",
      hoursKicker: "Години роботи",
      hoursTitle: "12:00 – 00:00",
      hoursText: "Вт – Чт до опівночі · Пт – Нд до 02:00",
      bookKicker: "Бронь",
      bookTitle: "На сайті",
      bookLink: "Забронювати стіл →",
    },
    experience: {
      titleSans: "чому",
      titleSerif: "12 FEET",
      lead: "Клуб для спокійної гри, гарного бару та компанії.",
      items: [
        {
          title: "Піраміда 12 ft",
          text: "Два професійних столи — руська піраміда, сукно та світло.",
        },
        {
          title: "Бар біля столу",
          text: "Кава, чай і пivo — замовляєте під час гри.",
        },
        {
          title: "Gentlemen's lounge",
          text: "М'яке світло, зручні місця, спокійна атмосфера в центрі.",
        },
        {
          title: "Бронь онлайн",
          text: "Дата, час, стіл 1 або 2 — ціна одразу в формі.",
        },
      ],
    },
    tables: {
      titleSans: "столи",
      titleSerif: "Піраміда",
      lead: "Два 12-футових столи для руської піраміди — повний розмір, тиха зала.",
      weekdayTitle: "Будні",
      weekdaySub: "Понеділок – четвер",
      weekendTitle: "Вихідні",
      weekendSub: "П'ятниця – неділя",
      perHour: "€ / год",
    },
    menu: {
      titleSans: "бар",
      titleSerif: "Меню",
      lead: "Кава, чай і пivo — усе, що замовляють за столом.",
      columns: getMenuColumns("uk"),
    },
    how: {
      titleSans: "три",
      titleSerif: "кроки до столу",
      lead: "Від вибору часу до підтвердження — бронь за хвилину.",
      steps: [
        {
          title: "Оберіть момент",
          text: "З 12:00. До опівночі в будні, до 02:00 на вихідних.",
        },
        {
          title: "Оберіть стіл",
          text: "Два столи 12 ft, 1–6 годин. 20 € Пн–Чт · 25 € Пт–Нд.",
        },
        {
          title: "Надішліть і грайте",
          text: "Форма онлайн — підтвердимо бронь і підготуємо стіл.",
        },
      ],
    },
    faq: {
      titleSans: "перед",
      titleSerif: "партією",
      items: [
        {
          q: "Скільки столів?",
          a: "Два повні столи 12 ft — дві партії одразу або зал для компанії.",
        },
        {
          q: "Скільки коштує година?",
          a: "20 € Пн–Чт, 25 € Пт–Нд. Сума рахується у формі автоматично.",
        },
        {
          q: "Чи потрібна бронь заздалегідь?",
          a: "Так, особливо ввечері та на вихідних — онлайн за хвилину, без дзвінків.",
        },
        {
          q: "Де вас знайти?",
          a: shared.address + " — центр Братислави, поруч із транспортом.",
        },
      ],
    },
    visit: {
      titleSans: "як",
      titleSerif: "нас знайти",
      lead: "Приходьте в клуб або спочатку забронюйте стіл онлайн.",
      bullets: [
        shared.address,
        "Вт – Чт 12:00 – 00:00",
        "Пт – Нд 12:00 – 02:00",
        "Бронь через форму на цій сторінці",
      ],
      mapLabel: "Відкрити в картах",
    },
    book: {
      titleSans: "забронюйте",
      titleSerif: "стіл",
      lead: "20 €/год у будні, 25 €/год п'ятниця – неділя.",
      date: "Дата",
      time: "Час",
      table: "Стіл",
      hours: "Годин",
      name: "Ім'я",
      namePh: "Ваше ім'я",
      phone: "Телефон",
      phonePh: "+421 …",
      previewEmpty: "Вкажіть дату й час",
      total: "Разом",
      submit: "Забронювати",
      table1: "Стіл 1",
      table2: "Стіл 2",
      perHour: "€/год",
      hourUnit: "год",
      hoursUnit: "год",
      hoursUnitMany: "год",
      done: "Дякуємо — підтвердимо бронь на",
      submitting: "Надсилаю…",
      submitError:
        "Не вдалося надіслати. Спробуйте ще раз або зателефонуйте в клуб.",
    },
    footer: {
      logo: "12 FEET",
      address: shared.address,
      hours: "Вт – Чт 12:00 – 00:00 · Пт – Нд 12:00 – 02:00",
      book: "Забронювати стіл",
      tag: "Billiard club & Gentlemen's lounge",
    },
    notFound: {
      title: "Сторінку не знайдено",
      text: "Перевірте адресу або перейдіть на головну.",
      home: "Головна",
    },
  },

  de: {
    meta: {
      title: "12 FEET — Billardclub & Gentlemen's Lounge, Bratislava",
      description:
        "Zwei 12-Fuß-Pyramidenbillards, Barkarte, Online-Reservierung. Záhradnícka 36.",
      ogTitle: "12 FEET Billard · Bratislava",
    },
    nav: {
      aria: "Hauptnavigation",
      tables: "Tische",
      prices: "Preise",
      menu: "Karte",
      visit: "Kontakt",
      book: "Reservieren",
      openMenu: "Menü öffnen",
      closeMenu: "Menü schließen",
      menuDialog: "Menü",
    },
    hero: {
      pre: "Billiard club",
      title: "12 FEET",
      post: "Gentlemen's lounge",
      lead: "Pyramide · zwei 12-Fuß-Tische · " + shared.address,
      cta: "Tisch reservieren",
    },
    about: {
      titleSans: "über",
      titleSerif: "12 FEET",
      lead: "Billardclub & Gentlemen's Lounge in Bratislava",
      addressKicker: "Adresse",
      addressTitle: "Záhradnícka 36",
      addressText: "Bratislava",
      hoursKicker: "Öffnungszeiten",
      hoursTitle: "12:00 – 00:00",
      hoursText: "Di – Do bis Mitternacht · Fr – So bis 02:00",
      bookKicker: "Reservierung",
      bookTitle: "Online",
      bookLink: "Tisch reservieren →",
    },
    experience: {
      titleSans: "warum",
      titleSerif: "12 FEET",
      lead: "Club für ruhiges Spiel, gute Bar und Gesellschaft.",
      items: [
        {
          title: "12-Fuß-Pyramide",
          text: "Zwei Profi-Tische — russische Pyramide, Tuch und Licht.",
        },
        {
          title: "Bar am Tisch",
          text: "Kaffee, Tee und Bier — bestellen während des Spiels.",
        },
        {
          title: "Gentlemen's lounge",
          text: "Sanftes Licht, Sitzkomfort, ruhige Atmosphäre in der Innenstadt.",
        },
        {
          title: "Online-Buchung",
          text: "Datum, Uhrzeit, Tisch 1 oder 2 — Preis sofort sichtbar.",
        },
      ],
    },
    tables: {
      titleSans: "tische",
      titleSerif: "Pyramide",
      lead: "Zwei 12-Fuß-Tische für russische Pyramide — volle Größe, ruhiger Saal.",
      weekdayTitle: "Wochentags",
      weekdaySub: "Montag – Donnerstag",
      weekendTitle: "Wochenende",
      weekendSub: "Freitag – Sonntag",
      perHour: "€ / Std.",
    },
    menu: {
      titleSans: "bar",
      titleSerif: "Karte",
      lead: "Kaffee, Tee und Bier — Bestellungen am Tisch.",
      columns: getMenuColumns("de"),
    },
    how: {
      titleSans: "drei",
      titleSerif: "Schritte zum Tisch",
      lead: "Von der Uhrzeit bis zur Bestätigung — Reservierung in einer Minute.",
      steps: [
        {
          title: "Moment wählen",
          text: "Ab 12:00. Bis Mitternacht unter der Woche, bis 02:00 am Wochenende.",
        },
        {
          title: "Tisch wählen",
          text: "Zwei 12-Fuß-Tische, 1–6 Stunden. 20 € Mo–Do · 25 € Fr–So.",
        },
        {
          title: "Senden & spielen",
          text: "Online-Formular — wir bestätigen und bereiten den Tisch vor.",
        },
      ],
    },
    faq: {
      titleSans: "vor",
      titleSerif: "der Partie",
      items: [
        {
          q: "Wie viele Tische?",
          a: "Zwei volle 12-Fuß-Tische — zwei Partien parallel oder der Raum für die Gruppe.",
        },
        {
          q: "Was kostet die Stunde?",
          a: "20 € Mo–Do, 25 € Fr–So. Die Summe rechnet das Formular automatisch.",
        },
        {
          q: "Vorher reservieren?",
          a: "Ja, besonders abends und am Wochenende — online in einer Minute.",
        },
        {
          q: "Wo findet man euch?",
          a: shared.address + " — Bratislava Zentrum, nah am ÖPNV.",
        },
      ],
    },
    visit: {
      titleSans: "so",
      titleSerif: "finden Sie uns",
      lead: "Kommen Sie vorbei oder reservieren Sie zuerst online.",
      bullets: [
        shared.address,
        "Di – Do 12:00 – 00:00",
        "Fr – So 12:00 – 02:00",
        "Reservierung über das Formular",
      ],
      mapLabel: "In Karten öffnen",
    },
    book: {
      titleSans: "tisch",
      titleSerif: "reservieren",
      lead: "20 €/h werktags, 25 €/h Fr–So.",
      date: "Datum",
      time: "Uhrzeit",
      table: "Tisch",
      hours: "Stunden",
      name: "Name",
      namePh: "Ihr Name",
      phone: "Telefon",
      phonePh: "+421 …",
      previewEmpty: "Datum und Uhrzeit wählen",
      total: "Gesamt",
      submit: "Reservieren",
      table1: "Tisch 1",
      table2: "Tisch 2",
      perHour: "€/Std.",
      hourUnit: "Std.",
      hoursUnit: "Std.",
      hoursUnitMany: "Std.",
      done: "Danke — wir bestätigen die Reservierung für",
      submitting: "Senden…",
      submitError:
        "Senden fehlgeschlagen. Bitte erneut versuchen oder anrufen.",
    },
    footer: {
      logo: "12 FEET",
      address: shared.address,
      hours: shared.hoursShort,
      book: "Tisch reservieren",
      tag: "Billiard club & Gentlemen's lounge",
    },
    notFound: {
      title: "Seite nicht gefunden",
      text: "URL prüfen oder zur Startseite.",
      home: "Start",
    },
  },
};

const tablesExtras: Record<
  Locale,
  Pick<Dictionary["tables"], "note" | "specs">
> = {
  sk: {
    note: "Oba stoly sú nezávislé — môžete hrať dve partie naraz alebo si zarezervovať celý zál pre skupinu.",
    specs: [
      {
        title: "12 ft pyramída",
        text: "Plná veľkosť, ruská pyramída, kvalitné plátno a rovnomerné osvetlenie.",
      },
      {
        title: "Stôl 1 & 2",
        text: "Dva samostatné stoly v jednom zál — rezervujete konkrétny stôl online.",
      },
      {
        title: "Bar pri hre",
        text: "Káva, čaj a pivo objednáte pri stole — bez prerušenia partie.",
      },
    ],
  },
  en: {
    note: "Both tables are independent — two games at once or book the room for a group.",
    specs: [
      {
        title: "12 ft pyramid",
        text: "Full-size Russian pyramid, quality cloth and even lighting.",
      },
      {
        title: "Table 1 & 2",
        text: "Two separate tables in one room — pick your table when booking online.",
      },
      {
        title: "Bar at the table",
        text: "Coffee, tea and beer served while you play.",
      },
    ],
  },
  ru: {
    note: "Два независимых стола — две партии одновременно или зал для компании.",
    specs: [
      {
        title: "12 ft пирамида",
        text: "Полный размер, русская пирамида, качественное сукно и свет.",
      },
      {
        title: "Стол 1 и 2",
        text: "Два отдельных стола в зале — выбираете при бронировании.",
      },
      {
        title: "Бар у стола",
        text: "Кофе, чай и пиво — заказ у стола без перерыва в игре.",
      },
    ],
  },
  uk: {
    note: "Два незалежні столи — дві партії одночасно або зал для компанії.",
    specs: [
      {
        title: "12 ft піраміда",
        text: "Повний розмір, російська піраміда, якісне сукно та світло.",
      },
      {
        title: "Стіл 1 і 2",
        text: "Два окремі столи в залі — обираєте при бронюванні.",
      },
      {
        title: "Бар біля столу",
        text: "Кава, чай і пиво — замовлення без перерви в грі.",
      },
    ],
  },
  de: {
    note: "Zwei unabhängige Tische — zwei Partien gleichzeitig oder den Raum für Gruppen.",
    specs: [
      {
        title: "12 ft Pyramide",
        text: "Vollgröße, russische Pyramide, Tuch und gleichmäßiges Licht.",
      },
      {
        title: "Tisch 1 & 2",
        text: "Zwei getrennte Tische — Wahl bei der Online-Reservierung.",
      },
      {
        title: "Bar am Tisch",
        text: "Kaffee, Tee und Bier — Bestellung während des Spiels.",
      },
    ],
  },
};

const faqLead: Record<Locale, string> = {
  sk: "Čo hostia pýtajú najčastejšie — pred prvou partiou.",
  en: "What guests ask most — before the first game.",
  ru: "Что гости спрашивают чаще всего — перед первой партией.",
  uk: "Що гості питають найчастіше — перед першою партією.",
  de: "Was Gäste am häufigsten fragen — vor der ersten Partie.",
};

const aboutExtra: Record<Locale, string> = {
  sk: "Klub spája ruskú pyramídu, bar a pokojnú atmosféru lounge — vhodné pre pravidelnú hru aj večer s priateľmi. Rezervácia stola je online, ceny sú prehľadné podľa dňa v týždni.",
  en: "The club brings together Russian pyramid, a full bar and a calm lounge atmosphere — for regular play or an evening with friends. Table booking is online; rates are clear by day of week.",
  ru: "Клуб сочетает русскую пирамида, бар и спокойную lounge-атмосферу — для регулярной игры или вечера с друзьями. Бронь стола онлайн, цены прозрачны по дням недели.",
  uk: "Клуб поєднує російську піраміду, бар і спокійну lounge-атмосферу — для регулярної гри чи вечора з друзями. Бронь онлайн, ціни зрозумілі за днями тижня.",
  de: "Der Club verbindet russische Pyramide, Bar und ruhige Lounge-Atmosphäre — für regelmäßiges Spiel oder einen Abend mit Freunden. Tischreservierung online, Preise klar nach Wochentag.",
};

const statsPack: Record<Locale, Dictionary["stats"]> = {
  sk: {
    aria: "Základné informácie",
    items: [
      { value: "2", label: "stoly 12 ft" },
      { value: "20–25 €", label: "za hodinu" },
      { value: "12:00", label: "otváracie od" },
      { value: "BS", label: "centrum mesta" },
    ],
  },
  en: {
    aria: "Key facts",
    items: [
      { value: "2", label: "12 ft tables" },
      { value: "€20–25", label: "per hour" },
      { value: "12:00", label: "opens from" },
      { value: "BS", label: "city centre" },
    ],
  },
  ru: {
    aria: "Ключевые факты",
    items: [
      { value: "2", label: "стола 12 ft" },
      { value: "20–25 €", label: "в час" },
      { value: "12:00", label: "открытие с" },
      { value: "BS", label: "центр города" },
    ],
  },
  uk: {
    aria: "Ключові факти",
    items: [
      { value: "2", label: "столи 12 ft" },
      { value: "20–25 €", label: "за годину" },
      { value: "12:00", label: "відкриття з" },
      { value: "BS", label: "центр міста" },
    ],
  },
  de: {
    aria: "Auf einen Blick",
    items: [
      { value: "2", label: "12-Fuß-Tische" },
      { value: "20–25 €", label: "pro Stunde" },
      { value: "12:00", label: "Öffnung ab" },
      { value: "BS", label: "Stadtzentrum" },
    ],
  },
};

const ctaPack: Record<Locale, Dictionary["cta"]> = {
  sk: {
    title: "Pripravení na partiu?",
    text: "Zvoľte dátum, čas a stôl — potvrdíme rezerváciu a pripravíme stôl pre vás.",
    button: "Rezervovať stôl",
  },
  en: {
    title: "Ready for a game?",
    text: "Pick date, time and table — we confirm your booking and prepare the table.",
    button: "Book a table",
  },
  ru: {
    title: "Готовы к партии?",
    text: "Выберите дату, время и стол — подтвердим бронь и подготовим стол.",
    button: "Забронировать стол",
  },
  uk: {
    title: "Готові до партії?",
    text: "Оберіть дату, час і стіл — підтвердимо бронь і підготуємо стіл.",
    button: "Забронювати стіл",
  },
  de: {
    title: "Bereit für eine Partie?",
    text: "Datum, Uhrzeit und Tisch wählen — wir bestätigen die Reservierung.",
    button: "Tisch reservieren",
  },
};

export function getDictionary(locale: Locale): Dictionary {
  const base = dictionaries[locale];
  return {
    ...base,
    about: { ...base.about, extra: aboutExtra[locale] },
    tables: { ...base.tables, ...tablesExtras[locale] },
    faq: { ...base.faq, lead: faqLead[locale] },
    stats: statsPack[locale],
    cta: ctaPack[locale],
  };
}
