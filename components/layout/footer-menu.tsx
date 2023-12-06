'use client';

import { Menu } from '@lib/tebex/types';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const FooterMenuItem = ({ item }: { item: Menu }) => {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.path);

  useEffect(() => {
    setActive(pathname === item.path);
  }, [pathname, item.path]);

  return (
    <li>
      <Link
        href={item.path}
        className={clsx(
          'block p-2 text-lg underline-offset-4 hover:text-black hover:underline dark:hover:text-neutral-300 md:inline-block md:text-sm',
          {
            'text-black dark:text-neutral-300': active
          }
        )}
      >
        {item.title}
      </Link>
    </li>
  );
};

const menu: Menu[] = [
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

export default function FooterMenu() {
  return (
    <nav>
      <ul>
        {menu.map((item: Menu) => {
          return <FooterMenuItem key={item.title} item={item} />;
        })}
      </ul>
    </nav>
  );
}
