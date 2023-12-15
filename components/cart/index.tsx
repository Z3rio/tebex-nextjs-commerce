'use client';

import { useBasket, useWebstoreData } from '@lib/hooks';
import CartModal from './modal';

export default function Cart() {
  const webstoreData = useWebstoreData();
  const cart = useBasket();
  const currency = webstoreData ? webstoreData.currency : 'EUR';

  return <CartModal cart={cart} currency={currency} />;
}
