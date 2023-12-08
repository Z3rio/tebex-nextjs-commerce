import { getCategory, getWebstoreData } from '@lib/tebex';
import type { Package } from '@lib/tebex/types';
import { GridTileImage } from 'components/grid/tile';
import Link from 'next/link';
import placeholderImage from '../../assets/placeholder-image.webp';

function ThreeItemGridItem({
  item,
  size,
  priority,
  currency
}: {
  item: Package;
  size: 'full' | 'half';
  priority?: boolean;
  currency: string;
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link className="relative block aspect-square h-full w-full" href={`/product/${item.id}`}>
        <GridTileImage
          src={item.image ?? placeholderImage}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.name}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.name,
            amount: item.total_price.toString(),
            currencyCode: currency
          }}
        />
      </Link>
    </div>
  );
}

export async function ThreeItemGrid() {
  // Collections that start with `hidden-*` are hidden from the search page.
  const homepageItems = await getCategory(
    Number(process.env.HOMEPAGE_THREE_ITEM_GRID_CATEGORY),
    true
  );
  const { currency } = await getWebstoreData();

  if (
    !homepageItems ||
    !homepageItems.packages[0] ||
    !homepageItems.packages[1] ||
    !homepageItems.packages[2]
  )
    return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems.packages;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} currency={currency} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} currency={currency} />
      <ThreeItemGridItem size="half" item={thirdProduct} currency={currency} />
    </section>
  );
}
