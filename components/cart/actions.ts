'use server';

import { TAGS } from '@lib/constants';
import { addToBasket, getBasket, removeFromBasket, updateQuantityInBasket } from '@lib/tebex';
import { Basket, PackageType } from '@lib/tebex/types';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function addItem(
  _prevState: unknown,
  data: { packageId: string; packageType: PackageType }
) {
  if (!data.packageId) {
    return 'Missing package variant ID';
  }

  const basketId = cookies().get('basketId')?.value;
  let cart: Basket | undefined;

  if (basketId) {
    cart = await getBasket(basketId);
  }

  if (!basketId || !cart) {
    return 'Missing cart id or cart data';
  }

  try {
    const addResp = await addToBasket(basketId, Number(data.packageId), data.packageType);

    if (addResp && 'status' in addResp && addResp.status == 422) {
      return 'You must login before doing this';
    } else {
      revalidateTag(TAGS.cart);
      return true;
    }
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, lineId: string) {
  const basketId = cookies().get('basketId')?.value;

  if (!basketId) {
    return 'Missing cart ID';
  }

  try {
    await removeFromBasket(basketId, Number(lineId));
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: string;
    quantity: number;
  }
) {
  const basketId = cookies().get('basketId')?.value;

  if (!basketId) {
    return 'Missing cart ID';
  }

  const { lineId, quantity } = payload;

  try {
    if (quantity === 0) {
      await removeFromBasket(basketId, Number(lineId));
      revalidateTag(TAGS.cart);
      return;
    }

    await updateQuantityInBasket(basketId, lineId, quantity);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error updating item quantity';
  }
}
