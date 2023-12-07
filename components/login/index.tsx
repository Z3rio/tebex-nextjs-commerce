import { getAuthUrl, getBasket } from '@lib/tebex';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import LoginModal from './modal';

export default async function Login() {
  const cartId = cookies().get('cartId')?.value;
  let cart;

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

    if (authUrls[0] !== undefined) {
      return <LoginModal authLink={authUrls[0].url} />;
    }
  }

  return notFound;
}
