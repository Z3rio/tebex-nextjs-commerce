import FilterItemDropdown from './dropdown';
import { FilterItem } from './item';

export type PathFilterItem = { title: string; path: string };

function FilterItemList({ list }: { list: PathFilterItem[] }) {
  return (
    <>
      {list.map((item: PathFilterItem, i) => (
        <FilterItem key={i} item={item} />
      ))}
    </>
  );
}

export default function FilterList({ list, title }: { list: PathFilterItem[]; title?: string }) {
  return (
    <>
      <nav>
        {title ? (
          <h3 className="hidden text-xs text-neutral-500 dark:text-neutral-400 md:block">
            {title}
          </h3>
        ) : null}
        <ul className="hidden md:block">
          <FilterItemList list={list} />
        </ul>
        <ul className="md:hidden">
          <FilterItemDropdown list={list} />
        </ul>
      </nav>
    </>
  );
}
