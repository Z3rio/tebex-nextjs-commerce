import clsx from 'clsx';
import { Suspense } from 'react';

import { getCategories } from '@lib/tebex';
import FilterList, { PathFilterItem } from './filter';

async function CategoryList() {
  const categories: PathFilterItem[] = [
    {
      title: 'All',
      path: '/search'
    },
    ...(await getCategories(true, (c) => c.packages.length !== 0))
      .sort((a, b) => {
        if (a.order < b.order) {
          return -1;
        } else if (a.order > b.order) {
          return 1;
        }

        return 0;
      })
      .map((c) => {
        return { title: c.name, path: `/search/${c.id}` };
      })
  ] as PathFilterItem[];
  return <FilterList list={categories} title="Categories" />;
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded';
const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700';

export default function Categories() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <CategoryList />
    </Suspense>
  );
}
