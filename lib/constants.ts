import { Menu } from './tebex/types';

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart',
  webstoreData: 'webstoreData'
};

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
