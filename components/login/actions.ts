'use server';

import { createBasket, getAuthUrl, getBasket } from '@lib/tebex';
import { Basket } from '@lib/tebex/types';
import { cookies } from 'next/headers';

export async function tryFetchAuthUrl(): Promise<string | undefined> {
  const cartId = cookies().get('cartId')?.value;
  let cart: Basket | undefined;

  if (cartId) {
    cart = await getBasket(cartId);
  } else {
    cart = await createBasket();

    if (cart) {
      cookies().set('cartId', cart.ident);
    }
  }

  if (cart) {
    const authUrls = await getAuthUrl(
      cart.ident,
      process.env.NODE_ENV == 'development'
        ? 'http://localhost:3000'
        : process.env.SITE_URL ?? 'about:blank'
    );

    if (authUrls[0] !== undefined) {
      return authUrls[0].url;
    }
  }

  return undefined;
}
