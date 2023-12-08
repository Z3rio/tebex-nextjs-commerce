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

  const collectionsPromise = getCategories(true).then((collections) => {
    return collections.map((collection) => {
      const date = collection.packages.reduce((highest, curr) => {
        const currDate = new Date(curr.updated_at).getTime();

        if (currDate > highest) {
          return currDate;
        } else {
          return highest;
        }
      }, -Infinity);

      return {
        url: `${baseUrl}/search/${collection.id}`,
        lastModified: new Date(date).toISOString()
      };
    });
  });

  const productsPromise = getPackages().then((products) => {
    return products.map((product) => {
      return {
        url: `${baseUrl}/product/${product.id}`,
        lastModified: product.updated_at
      };
    });
  });

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (await Promise.all([collectionsPromise, productsPromise])).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes];
}
