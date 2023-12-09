import { baseUrl, privateApiKey, publicApiKey, simpleRequest } from '@lib/tebex';
import { Basket, Data } from '@lib/tebex/types';
import { cookies, headers } from 'next/headers';

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
      cookies().set('cartId', cart.ident);

      return Response.json({
        ok: true
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
