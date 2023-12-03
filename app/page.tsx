// import { Carousel } from 'components/carousel';
// import { ThreeItemGrid } from 'components/grid/three-items';
// import Footer from 'components/layout/footer';
// import { Suspense } from 'react';

import { getPackages } from '@lib/tebex';

export const runtime = 'edge';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Tebex.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  const packages = await getPackages();

  return (
    <>
      {JSON.stringify(packages)}
      {/* <ThreeItemGrid />
      <Suspense>
        <Carousel />
        <Suspense>
          <Footer />
        </Suspense>
      </Suspense> */}
    </>
  );
}
