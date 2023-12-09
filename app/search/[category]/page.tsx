import { getCategory, getWebstoreData } from '@lib/tebex';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import PackageGridItems from 'components/layout/package-grid-items';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = await getCategory(Number(params.category));

  if (!category) return notFound();

  return {
    title: category.name,
    description: category.description
  };
}

export default async function CategoryPage({
  params
}: {
  params: { category: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const category = await getCategory(Number(params.category), true);
  const webstoreData = await getWebstoreData();
  const currency = webstoreData ? webstoreData.currency : 'EUR';

  if (!category) {
    return notFound;
  }

  return (
    <section>
      {category.packages.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <PackageGridItems packages={category.packages} currency={currency} />
        </Grid>
      )}
    </section>
  );
}
