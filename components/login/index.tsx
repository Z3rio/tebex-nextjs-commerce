import { getAuthUrl, getBasket } from '@lib/tebex';
import { cookies } from 'next/headers';
import LoginModal from './modal';

export default async function Login() {
  const cartId = cookies().get('cartId')?.value;
  let cart;
  let authUrl;

  if (cartId) {
    cart = await getBasket(cartId);
  }

  if (cart) {
    const authUrls = await getAuthUrl(
      cart.ident,
      process.env.NODE_ENV == 'development'
        ? 'http://localhost:3000'
        : process.env.SITE_URL ?? 'about:blank'
    );

    if (authUrls[0]) {
      authUrl = authUrls[0].url;
    }
  }

  return <LoginModal authLink={authUrl} cart={cart} />;
}
