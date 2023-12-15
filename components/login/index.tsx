'use client';

import { useAuthUrl, useBasket } from '@lib/hooks';
import LoginModal from './modal';

export default function Login() {
  const basket = useBasket();
  const authUrl = useAuthUrl(basket);

  return <LoginModal authLink={authUrl} basket={basket} />;
}
