import { Menu } from './tebex/types';

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart'
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2023-01/graphql.json';

export const menu: Menu[] = [
  {
    title: 'Homepage',
    path: '/'
  },
  {
    title: 'About',
    path: '/about'
  },
  {
    title: 'Terms & Conditions',
    path: '/terms-conditions'
  },
  {
    title: 'Privacy Policy',
    path: '/privacy-policy'
  },
  {
    title: 'FAQ',
    path: '/frequently-asked-questions'
  }
];

export const navMenu: Menu[] = [
  {
    title: 'Homepage',
    path: '/'
  },
  {
    title: 'Products',
    path: '/search'
  },
  {
    title: 'Documentation',
    path: 'https://docs.zerio-scripts.com/'
  }
];
