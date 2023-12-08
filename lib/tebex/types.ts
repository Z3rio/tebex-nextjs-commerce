export interface Code {
  code: string;
}

export interface InBasket {
  quantity: number;
  price: number;
  gift_username_id: string | null;
  gift_username: string | null;
}

export interface BaseItem {
  id: number;
  name: string;
}

export interface GiftCardCode {
  card_number: string;
}

export interface Links {
  checkout: string;
  [key: string]: string;
}

export interface Data<T> {
  data: T;
}

export type PackageType = 'subscription' | 'single';

export type Package = BaseItem & {
  description: string;
  type: PackageType;
  disable_gifting: boolean;
  disable_quantity: boolean;
  expiration_date: string | null;
  category: BaseItem;
  base_price: number;
  sales_tax: number;
  total_price: number;
  discount: number;
  image: string | null;
  created_at: string;
  updated_at: string;
};

export type Category = BaseItem & {
  description: string;
  parent: Category | null;
  order: number;
  packages: Package[];
  display_type: 'grid' | 'list';
};

export type BasketPackage = BaseItem & {
  description: string;
  image?: string;
  in_basket: InBasket;
};

export interface Basket {
  ident: string;
  complete: boolean;
  id: number;
  count: string;
  ip: string;
  username_id: string | null;
  username: string | null;
  base_price: number;
  sales_tax: number;
  total_price: number;
  packages: BasketPackage[];
  coupons: Code[];
  giftcards: GiftCardCode[];
  creator_code: string;
  links: Links;
}

export type Menu = {
  title: string;
  path: string;
};

export interface Message {
  status: number;
  type: string;
  title: string;
  detail: string;
  error_code: string;
  field_details: unknown[];
  meta: unknown[];
}

export interface AuthUrl {
  name: string;
  url: string;
}

export interface Webstore {
  id: number;
  description: string;
  name: string;
  webstore_url: string;
  currency: string;
  lang: string;
  logo?: string;
  platform_type: string;
  created_at?: string;
}
