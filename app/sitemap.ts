import { getCategories, getPackages } from '@lib/tebex';
import { validateEnvironmentVariables } from '@lib/utils';
import { MetadataRoute } from 'next';

type Route = {
  url: string;
  lastModified: string;
};

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  const collectionsPromise = getCategories().then((collections) =>
    collections.map((collection) => ({
      url: `${baseUrl}/search/${collection.id}`,
      // todo: fix last modified date
      lastModified: 'Unknown'
    }))
  );

  const productsPromise = getPackages().then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: product.updated_at
    }))
  );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (await Promise.all([collectionsPromise, productsPromise, pagesPromise])).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes];
}
