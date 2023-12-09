import { getCategories, getPackages } from '@lib/tebex';
import { validateEnvironmentVariables } from '@lib/utils';
import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

interface SitemapEntry {
  url: string;
  lastModified: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  const collectionsMap: SitemapEntry[] = [];
  const categories = await getCategories(true);

  categories.forEach((collection) => {
    if (collection.packages.length >= 1) {
      const date = collection.packages.reduce((highest, curr) => {
        const currDate = new Date(curr.updated_at).getTime();

        if (currDate > highest) {
          return currDate;
        } else {
          return highest;
        }
      }, -1);

      if (date !== -1) {
        collectionsMap.push({
          url: `${baseUrl}/search/${collection.id}`,
          lastModified: new Date(date).toISOString()
        });
      }
    }
  });

  const productsMap = (await getPackages()).map((product) => {
    return {
      url: `${baseUrl}/product/${product.id}`,
      lastModified: product.updated_at
    };
  });

  return [...routesMap, ...productsMap, ...collectionsMap];
}
