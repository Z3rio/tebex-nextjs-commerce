import { TAGS } from '@lib/constants';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Basket, Category, Data, Package, PackageType } from 'tebex_headless';
import { Page } from './types';

const publicApiKey = process.env.TEBEX_PUBLIC_API_KEY ? process.env.TEBEX_PUBLIC_API_KEY : '';
const baseUrl = 'https://headless.tebex.io/api';

// const removeEdgesAndNodes = (array: Connection<any>) => {
//   return array.edges.map((edge) => edge?.node);
// };

const reshapeCategory = (category: Category): Category => {
  return category;
};

// const reshapeImages = (images: Connection<Image>, productTitle: string) => {
//   const flattened = removeEdgesAndNodes(images);

//   return flattened.map((image) => {
//     const filename = image.url.match(/.*\/(.*)\..*/)[1];
//     return {
//       ...image,
//       altText: image.altText || `${productTitle} - ${filename}`
//     };
//   });
// };

export async function createBasket(): Promise<Basket> {
  const res = await simpleRequest<Data<Basket>>(
    `${baseUrl}/accounts/${publicApiKey}/baskets`,
    {},
    {},
    { method: 'POST' }
  );

  return res.data;
}

export async function addToBasket(
  basketId: string,
  packageId: number,
  packageType: PackageType
): Promise<Basket> {
  const res = await simpleRequest<Data<Basket>>(
    `${baseUrl}/baskets/${basketId}/packages`,
    {
      type: packageType,
      package_id: packageId
    },
    {},
    { method: 'POST' }
  );

  return res.data;
}

export async function removeFromBasket(basketId: string, packageId: number): Promise<Basket> {
  const res = await simpleRequest<Data<Basket>>(
    `${baseUrl}/baskets/${basketId}/packages/remove`,
    {
      package_id: packageId
    },
    {},
    { method: 'POST' }
  );

  return res.data;
}

export async function getPage(handle: string): Promise<Page | undefined> {
  // const res = await shopifyFetch<ShopifyPageOperation>({
  //   query: getPageQuery,
  //   variables: { handle }
  // });
  // return res.body.data.pageByHandle;
  return undefined;
}
export async function getPages(): Promise<Page[]> {
  // const res = await shopifyFetch<ShopifyPagesOperation>({
  //   query: getPagesQuery
  // });
  // return removeEdgesAndNodes(res.body.data.pages);
  return [];
}

export async function getBasket(basketId: string): Promise<Basket | undefined> {
  const res = await simpleRequest<Data<Basket>>(
    `${baseUrl}/accounts/${publicApiKey}/baskets/${basketId}`
  );

  return res.data;
}

export async function getCategory(
  categoryId: number,
  includePackages = false
): Promise<Category | undefined> {
  const res = await simpleRequest<Data<Category>>(
    `${baseUrl}/accounts/${publicApiKey}/categories/${categoryId}?includePackages=${(includePackages
      ? 1
      : 0
    ).toString()}`
  );

  return res.data;
}

export async function getCategories(includePackages = false): Promise<Category[]> {
  const res = await simpleRequest<Data<Category[]>>(
    `${baseUrl}/accounts/${publicApiKey}/categories?includePackages=${(includePackages
      ? 1
      : 0
    ).toString()}`
  );

  return res.data;
}

export async function simpleRequest<T>(
  url: string,
  body?: Record<string, unknown>,
  headers?: Record<string, unknown>,
  custom?: Record<string, unknown>
) {
  const res = await fetch(url, {
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json; charset=UTF8',
      ...(headers ? headers : {})
    },
    method: 'GET',
    ...(custom ? custom : {})
  });

  return (await res.json()) as T;
}

export async function getPackages(query?: string, reverse = false): Promise<Package[]> {
  query = query ? query.toLowerCase() : query;

  const res = await simpleRequest<Data<Package[]>>(`${baseUrl}/accounts/${publicApiKey}/packages`);
  const data = res.data;
  const reshaped = reverse ? data.reverse() : data;

  return reshaped.filter((pkg) => query == undefined || pkg.name.toLowerCase().includes(query));
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];
  const topic = headers().get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
