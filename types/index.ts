export interface PriceRow {
  title: string;
  subtitle: string;
  price: number;
}

export interface MenuItem {
  name: string;
  price?: string;
}

export interface MenuColumn {
  heading: string;
  items: MenuItem[];
  subheading?: string;
  subItems?: string[];
  note?: string;
}

export interface BookingFormState {
  date: string;
  time: string;
  table: string;
  hours: number;
  name: string;
  phone: string;
}
