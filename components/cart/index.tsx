import { getBasket, getWebstoreData } from '@lib/tebex';
import { cookies } from 'next/headers';
import CartModal from './modal';

export default async function Cart() {
  const cartId = cookies().get('cartId')?.value;
  const webstoreData = await getWebstoreData();
  const currency = webstoreData ? webstoreData.currency : 'EUR';

  let cart;

  if (cartId) {
    cart = await getBasket(cartId);
  }

  return <CartModal cart={cart} currency={currency} />;
}
