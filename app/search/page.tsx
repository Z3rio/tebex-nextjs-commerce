import { getPackages, getWebstoreData } from '@lib/tebex';
import Grid from 'components/grid';
import PackageGridItems from 'components/layout/package-grid-items';

export const runtime = 'edge';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { q: searchValue } = searchParams as { [key: string]: string };
  const webstoreData = await getWebstoreData();
  const currency = webstoreData ? webstoreData.currency : 'EUR';

  const packages = await getPackages(searchValue);
  const resultsText = packages.length > 1 ? 'results' : 'result';

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {packages.length === 0
            ? 'There are no products that match '
            : `Showing ${packages.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {packages.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <PackageGridItems packages={packages} currency={currency} />
        </Grid>
      ) : null}
    </>
  );
}
