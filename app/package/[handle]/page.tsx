import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// import Footer from 'components/layout/footer';
import { getPackage, getWebstoreData } from '@lib/tebex';
import Footer from 'components/layout/footer';
import { Gallery } from 'components/package/gallery';
import { PackageDescription } from 'components/package/package-description';
import { Suspense } from 'react';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const packageData = await getPackage(Number(params.handle));

  if (!packageData) return notFound();

  return {
    title: packageData.name,
    description: packageData.description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: packageData.image
      ? {
          images: [
            {
              url: packageData.image,
              // width,
              // height,
              alt: packageData.name
            }
          ]
        }
      : null
  };
}

export default async function PackagePage({ params }: { params: { handle: string } }) {
  const packageData = await getPackage(Number(params.handle));
  const webstoreData = await getWebstoreData();
  const currency = webstoreData ? webstoreData.currency : 'EUR';

  if (!packageData) return notFound();

  const packageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: packageData.name,
    description: packageData.description,
    image: packageData.image,
    offers: {
      '@type': 'AggregateOffer',
      availability: 'https://schema.org/InStock',
      priceCurrency: currency,
      price: packageData.total_price
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(packageJsonLd)
        }}
      />
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Gallery
              images={
                packageData.image
                  ? [
                      {
                        src: packageData.image,
                        altText: packageData.name
                      }
                    ]
                  : []
              }
            />
          </div>

          <div className="basis-full lg:basis-2/6">
            <PackageDescription packageData={packageData} currency={currency} />
          </div>
        </div>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
