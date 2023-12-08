import { Package } from '@lib/tebex/types';
import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';

export function ProductDescription({ product, currency }: { product: Package; currency: string }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.name}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price amount={product.total_price.toString()} currencyCode={currency} />
        </div>
      </div>

      {product.description ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.description}
        />
      ) : null}

      <AddToCart packageId={product.id.toString()} packageType={product.type} />
    </>
  );
}
