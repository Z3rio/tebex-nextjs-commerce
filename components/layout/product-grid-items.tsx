import { Package } from '@lib/tebex/types';
import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import Link from 'next/link';
import placeholderImage from '../../assets/placeholder-image.webp';

export default function ProductGridItems({
  products,
  currency
}: {
  products: Package[];
  currency: string;
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.id} className="animate-fadeIn">
          <Link className="relative inline-block h-full w-full" href={`/product/${product.id}`}>
            <GridTileImage
              alt={product.name}
              label={{
                title: product.name,
                amount: product.total_price.toString(),
                currencyCode: currency
              }}
              src={product.image ?? placeholderImage}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
