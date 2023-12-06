export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

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

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Menu = {
  title: string;
  path: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Product = Omit<ShopifyProduct, 'variants' | 'images'> & {
  variants: ProductVariant[];
  images: Image[];
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type SEO = {
  title: string;
  description: string;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type ShopifyMenuOperation = {
  data: {
    menu?: {
      items: {
        title: string;
        url: string;
      }[];
    };
  };
  variables: {
    handle: string;
  };
};

export type ShopifyPageOperation = {
  data: { pageByHandle: Page };
  variables: { handle: string };
};

export type ShopifyPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};

export type ShopifyProductRecommendationsOperation = {
  data: {
    productRecommendations: ShopifyProduct[];
  };
  variables: {
    productId: string;
  };
};

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
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
