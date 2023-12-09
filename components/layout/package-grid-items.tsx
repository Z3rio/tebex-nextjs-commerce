import { Package } from '@lib/tebex/types';
import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import Link from 'next/link';
import placeholderImage from '../../assets/placeholder-image.webp';

export default function PackageGridItems({
  packages,
  currency
}: {
  packages: Package[];
  currency: string;
}) {
  return (
    <>
      {packages.map((packageData) => (
        <Grid.Item key={packageData.id} className="animate-fadeIn">
          <Link className="relative inline-block h-full w-full" href={`/package/${packageData.id}`}>
            <GridTileImage
              alt={packageData.name}
              label={{
                title: packageData.name,
                amount: packageData.total_price.toString(),
                currencyCode: currency
              }}
              src={packageData.image ?? placeholderImage}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
