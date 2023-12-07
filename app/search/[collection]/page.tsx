import { getCategory } from '@lib/tebex';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const collection = await getCategory(Number(params.collection));

  if (!collection) return notFound();

  return {
    title: collection.name,
    description: collection.description
  };
}

export default async function CategoryPage({
  params
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const product = await getCategory(Number(params.collection), true);

  if (!product) {
    return notFound;
  }

  return (
    <section>
      {product.packages.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={product.packages} />
        </Grid>
      )}
    </section>
  );
}
