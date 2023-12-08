import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// import Footer from 'components/layout/footer';
import { getPackage, getWebstoreData } from '@lib/tebex';
import Footer from 'components/layout/footer';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
import { Suspense } from 'react';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getPackage(Number(params.handle));

  if (!product) return notFound();

  return {
    title: product.name,
    description: product.description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: product.image
      ? {
          images: [
            {
              url: product.image,
              // width,
              // height,
              alt: product.name
            }
          ]
        }
      : null
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getPackage(Number(params.handle));
  const webstoreData = await getWebstoreData();
  const currency = webstoreData ? webstoreData.currency : 'EUR';

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'AggregateOffer',
      availability: 'https://schema.org/InStock',
      priceCurrency: currency,
      price: product.total_price
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Gallery
              images={
                product.image
                  ? [
                      {
                        src: product.image,
                        altText: product.name
                      }
                    ]
                  : []
              }
            />
          </div>

          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={product} currency={currency} />
          </div>
        </div>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
