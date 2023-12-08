import { TAGS } from '@lib/constants';
import { AuthUrl, Basket, Category, Data, Message, Package, PackageType, Webstore } from './types';

const publicApiKey = process.env.TEBEX_PUBLIC_API_KEY ? process.env.TEBEX_PUBLIC_API_KEY : '';
const baseUrl = 'https://headless.tebex.io/api';

export async function createBasket(): Promise<Basket | undefined> {
  const res = await simpleRequest<Data<Basket>>(
    `${baseUrl}/accounts/${publicApiKey}/baskets`,
    {},
    {},
    { method: 'POST' }
  );

  if (res) {
    return res.data;
  } else {
    return undefined;
  }
}

export async function addToBasket(
  basketId: string,
  packageId: number,
  packageType: PackageType
): Promise<Data<Basket> | Message | undefined> {
  const res = await simpleRequest<Data<Basket> | Message>(
    `${baseUrl}/baskets/${basketId}/packages`,
    {
      type: packageType,
      package_id: packageId
    },
    {},
    { method: 'POST' }
  );

  return res;
}

export async function getAuthUrl(basketId: string, returnUrl: string): Promise<AuthUrl[]> {
  const res = await simpleRequest<AuthUrl[]>(
    `${baseUrl}/accounts/${publicApiKey}/baskets/${basketId}/auth?returnUrl=${returnUrl}`
  );

  if (res) {
    return res;
  } else {
    return [];
  }
}

export async function removeFromBasket(
  basketId: string,
  packageId: number
): Promise<Data<Basket> | Message | undefined> {
  const res = await simpleRequest<Data<Basket> | Message>(
    `${baseUrl}/baskets/${basketId}/packages/remove`,
    {
      package_id: packageId
    },
    {},
    { method: 'POST' }
  );

  return res;
}

export async function updateQuantityInBasket(
  basketId: string,
  packageId: string,
  newQuantity: number
): Promise<Data<Basket> | Message | undefined> {
  const res = await simpleRequest<Data<Basket> | Message>(
    `${baseUrl}/baskets/${basketId}/packages/${packageId}`,
    {
      quantity: newQuantity
    },
    {},
    { method: 'PUT' }
  );

  return res;
}

export async function getBasket(basketId: string): Promise<Basket | undefined> {
  const res = await simpleRequest<Data<Basket>>(
    `${baseUrl}/accounts/${publicApiKey}/baskets/${basketId}`,
    undefined,
    {},
    {
      next: {
        tags: [TAGS.cart]
      }
    }
  );

  if (res) {
    return res.data;
  } else {
    return undefined;
  }
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

  if (res) {
    return res.data;
  } else {
    return undefined;
  }
}

export async function getWebstoreData(): Promise<Webstore | undefined> {
  const res = await simpleRequest<Data<Webstore>>(
    `${baseUrl}/accounts/${publicApiKey}`,
    undefined,
    {},
    {
      next: {
        tags: [TAGS.webstoreData]
      }
    }
  );

  if (res) {
    return res.data;
  } else {
    return undefined;
  }
}

export async function getCategories(
  includePackages = false,
  checker: (category: Category) => boolean = () => true
): Promise<Category[]> {
  const res = await simpleRequest<Data<Category[]>>(
    `${baseUrl}/accounts/${publicApiKey}/categories?includePackages=${(includePackages
      ? 1
      : 0
    ).toString()}`
  );

  if (res) {
    return res.data.filter(checker);
  } else {
    return [];
  }
}

export async function simpleRequest<T>(
  url: string,
  body?: Record<string, unknown>,
  headers?: Record<string, unknown>,
  custom?: Record<string, unknown>
): Promise<T | undefined> {
  try {
    const res = await fetch(url, {
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json; charset=UTF8',
        ...(headers ? headers : {})
      },
      method: 'GET',
      cache: 'no-store',
      ...(custom ? custom : {})
    });

    return (await res.json()) as T;
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

export async function getPackages(query?: string, reverse = false): Promise<Package[]> {
  query = query ? query.toLowerCase() : query;

  const res = await simpleRequest<Data<Package[]>>(`${baseUrl}/accounts/${publicApiKey}/packages`);

  if (res) {
    const data = res.data;
    const reshaped = reverse ? data.reverse() : data;

    return reshaped.filter((pkg) => query == undefined || pkg.name.toLowerCase().includes(query));
  } else {
    return [];
  }
}

export async function getPackage(id: number): Promise<Package | undefined> {
  const res = await simpleRequest<Data<Package>>(
    `${baseUrl}/accounts/${publicApiKey}/packages/${id}`
  );

  if (res) {
    return res.data;
  } else {
    return undefined;
  }
}
