import { TAGS } from '@lib/constants';
import { ensureStartsWith } from '@lib/utils';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  AddPackageToBasket,
  Basket,
  Category,
  CreateBasket,
  GetCategories,
  GetCategory,
  GetPackage,
  Package,
  PackageType,
  RemovePackage,
  SetWebstoreIdentifier
} from 'tebex_headless';
import { Connection, Menu, Page } from './types';

const domain =
  process.env.NODE_ENV == 'development'
    ? 'http://localhost:3000/'
    : process.env.BASE_URL
    ? ensureStartsWith(process.env.BASE_URL, 'https://')
    : '';
const publicApiKey = process.env.TEBEX_PUBLIC_API_KEY ? process.env.TEBEX_PUBLIC_API_KEY : '';
const baseUrl = 'https://headless.tebex.io/api';

SetWebstoreIdentifier(publicApiKey);

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeBasket = (basket: Basket): Basket => {
  return basket;
};

const reshapeCategories = (categories: Category[]): Category[] => {
  return categories;
};

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

const reshapePackage = (
  pkg: Package
  // filterHiddenProducts: boolean = true
): Package => {
  // if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
  //   return undefined;
  // }
  // const { images, variants, ...rest } = product;
  // return {
  //   ...rest,
  //   images: reshapeImages(images, product.title),
  //   variants: removeEdgesAndNodes(variants)
  // };

  return pkg;
};

const reshapePackages = (packages: Package[]): Package[] => {
  // const reshapedProducts = [];

  // for (const product of products) {
  //   if (product) {
  //     const reshapedProduct = reshapeProduct(product);

  //     if (reshapedProduct) {
  //       reshapedProducts.push(reshapedProduct);
  //     }
  //   }
  // }

  // return reshapedProducts;
  return packages;
};

export async function createBasket(): Promise<Basket> {
  const res = await CreateBasket(domain, domain + '?cancelled=true');

  return reshapeBasket(res);
}

export async function addToBasket(
  basketId: string,
  packageId: number,
  packageType: PackageType
): Promise<Basket> {
  return reshapeBasket(await AddPackageToBasket(basketId, packageId, 1, packageType));
}

export async function removeFromBasket(basketId: string, packageId: number): Promise<Basket> {
  return reshapeBasket(await RemovePackage(basketId, packageId));
}

// export async function updateBasket(
//   cartId: string,
//   lines: { id: string; merchandiseId: string; quantity: number }[]
// ): Promise<Basket> {
//   const res = await shopifyFetch<ShopifyUpdateCartOperation>({
//     query: editCartItemsMutation,
//     variables: {
//       cartId,
//       lines
//     },
//     cache: 'no-store'
//   });

//   return reshapeBasket(res.body.data.cartLinesUpdate.cart);
// }

export async function getBasket(basketId: string): Promise<Basket | undefined> {
  const res = await getBasket(basketId);

  if (!res) {
    return undefined;
  }

  return reshapeBasket(res);
}

export async function getCategory(
  categoryId: number,
  includePackages = false
): Promise<Category | undefined> {
  return reshapeCategory(await GetCategory(categoryId, includePackages));
}

export async function getCategories(includePackages = false): Promise<Category[]> {
  return reshapeCategories(await GetCategories(includePackages));
}

export async function getMenu(handle: string): Promise<Menu[]> {
  // const res = await shopifyFetch<ShopifyMenuOperation>({
  //   query: getMenuQuery,
  //   tags: [TAGS.collections],
  //   variables: {
  //     handle
  //   }
  // });

  // return (
  //   res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
  //     title: item.title,
  //     path: item.url.replace(domain, '').replace('/collections', '/search').replace('/pages', '')
  //   })) || []
  // );
  return [];
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

export async function getPackage(id: number): Promise<Package | undefined> {
  const res = await GetPackage(id);

  return reshapePackage(res);
}

export async function simpleRequest<T>(
  url: string,
  headers: Record<string, string> = {},
  body?: Record<string, unknown>
) {
  const res = await fetch(url, {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json; charset=UTF8',
      ...headers
    },
    method: 'GET'
  });

  return (await res.json()) as T;
}

export async function getPackages(query?: string, reverse = false): Promise<Package[]> {
  const res = await simpleRequest<Package[]>(`${baseUrl}/accounts/${publicApiKey}/packages`);

  return reshapePackages(reverse ? res.reverse() : res).filter(
    (pkg) => query == undefined || pkg.name.includes(query)
  );
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
