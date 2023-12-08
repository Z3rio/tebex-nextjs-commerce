'use server';

import { createBasket } from '@lib/tebex';
import { cookies } from 'next/headers';

export async function createNewBasket() {
  const cart = await createBasket();

  if (cart) {
    cookies().set('cartId', cart.ident);
  }
}

export async function removeBasket() {
  console.log('hi');
  cookies().delete('cartId');
}
