import { simpleRequest } from '@lib/tebex';
import { Basket, Data } from '@lib/tebex/types';
import { cookies, headers } from 'next/headers';

const baseUrl = process.env.TEBEX_BASE_URL ? process.env.TEBEX_BASE_URL : '';
const publicApiKey = process.env.TEBEX_PUBLIC_API_KEY ? process.env.TEBEX_PUBLIC_API_KEY : '';
const privateApiKey = process.env.TEBEX_PRIVATE_API_KEY ? process.env.TEBEX_PRIVATE_API_KEY : '';

export async function POST() {
  const ip = headers().get('X-Forwarded-For');

  if (ip) {
    const res = await simpleRequest<Data<Basket>>(
      `${baseUrl}/accounts/${publicApiKey}/baskets`,
      ip
        ? {
            ip_address: ip
          }
        : {},
      ip
        ? {
            Authorization: `Basic ${Buffer.from(`${publicApiKey}:${privateApiKey}`).toString(
              'base64'
            )}`
          }
        : {},
      { method: 'POST' }
    );

    const cart = res?.data;
    if (cart) {
      cookies().set('basketId', cart.ident);

      return Response.json({
        ok: true,
        basketId: cart.ident
      });
    } else {
      return Response.json({
        ok: false,
        msg: `Invalid Cart, (${cart}, ${ip})`
      });
    }
  } else {
    return Response.json({
      ok: false,
      msg: `Invalid IP (${ip})`
    });
  }
}
