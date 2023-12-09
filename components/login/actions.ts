'use server';

import { cookies } from 'next/headers';

export async function removeBasket() {
  cookies().delete('cartId');
}
