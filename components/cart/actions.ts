'use server';

import { TAGS } from '@lib/constants';
import { addToBasket, createBasket, getAuthUrl, getBasket } from '@lib/tebex';
import { PackageType } from '@lib/tebex/types';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function addItem(
  _prevState: unknown,
  data: { packageId: string; packageType: PackageType }
) {
  let cartId = cookies().get('cartId')?.value;
  let cart;

  if (cartId) {
    cart = await getBasket(cartId);
  }

  if (!cartId || !cart) {
    cart = await createBasket();
    cartId = cart.ident.toString();
    cookies().set('cartId', cartId);
  }

  if (!data.packageId) {
    return 'Missing product variant ID';
  }

  try {
    const addResp = await addToBasket(cartId, Number(data.packageId), data.packageType);

    if ('status' in addResp && addResp.status == 422) {
      const authUrls = await getAuthUrl(
        cartId,
        process.env.NODE_ENV == 'development'
          ? 'http://localhost:3000'
          : process.env.SITE_URL ?? 'about:blank'
      );

      if (authUrls[0] !== undefined) {
        return 'You must login before doing this';
      } else {
        return 'Could not find any Auth URLs';
      }
    } else {
      revalidateTag(TAGS.cart);
      return 'Ran successfully';
    }
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, lineId: string) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    await removeFromCart(cartId, [lineId]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: string;
    variantId: string;
    quantity: number;
  }
) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { lineId, variantId, quantity } = payload;

  try {
    if (quantity === 0) {
      await removeFromCart(cartId, [lineId]);
      revalidateTag(TAGS.cart);
      return;
    }

    await updateCart(cartId, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity
      }
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error updating item quantity';
  }
}
