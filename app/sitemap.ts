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

  const categoriesMap: SitemapEntry[] = [];
  const categories = await getCategories(true);

  categories.forEach((category) => {
    if (category.packages.length >= 1) {
      const date = category.packages.reduce((highest, curr) => {
        const currDate = new Date(curr.updated_at).getTime();

        if (currDate > highest) {
          return currDate;
        } else {
          return highest;
        }
      }, -1);

      if (date !== -1) {
        categoriesMap.push({
          url: `${baseUrl}/search/${category.id}`,
          lastModified: new Date(date).toISOString()
        });
      }
    }
  });

  const packagesMap = (await getPackages()).map((packageData) => {
    return {
      url: `${baseUrl}/package/${packageData.id}`,
      lastModified: packageData.updated_at
    };
  });

  return [...routesMap, ...packagesMap, ...categoriesMap];
}
