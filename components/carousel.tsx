import { getCategory, getWebstoreData } from '@lib/tebex';
import Link from 'next/link';
import placeholderImage from '../assets/placeholder-image.webp';
import { GridTileImage } from './grid/tile';

export async function Carousel() {
  // Collections that start with `hidden-*` are hidden from the search page.
  const category = await getCategory(Number(process.env.CAROUSEL_ITEMS_CATEGORY), true);
  const webstoreData = await getWebstoreData();
  const currency = webstoreData ? webstoreData.currency : 'EUR';

  if (!category || !category.packages) return null;

  // Purposefully duplicating packages to make the carousel loop and not run out of packages on wide screens.
  const carouselPackages = [...category.packages, ...category.packages, ...category.packages];

  return (
    <div className=" w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {carouselPackages.map((packageData, i) => (
          <li
            key={`${packageData.id}${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <Link href={`/package/${packageData.id}`} className="relative h-full w-full">
              <GridTileImage
                alt={packageData.name}
                label={{
                  title: packageData.name,
                  amount: packageData.total_price.toString(),
                  currencyCode: currency
                }}
                src={packageData.image ?? placeholderImage}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
