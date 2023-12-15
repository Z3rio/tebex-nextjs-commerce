import { useCallback, useEffect, useState } from 'react';
import { getAuthUrl, getBasket, getBasketId, getPackage, getWebstoreData } from './tebex';
import { Basket, Package, Webstore } from './tebex/types';

export function useBasket(): undefined | Basket {
  const [basket, setBasket] = useState<Basket | undefined>(undefined);

  const fetchBasket = useCallback(() => {
    getBasketId().then((basketId) => {
      if (basketId) {
        getBasket(basketId).then((newBasket) => {
          setBasket(newBasket);
        });
      } else {
        fetch('/createNewBasket', {
          body: undefined,
          headers: {
            'Content-Type': 'application/json; charset=UTF8'
          },
          method: 'POST',
          cache: 'no-store'
        })
          .then((resp) => resp.json())
          .then((basketId: { basketId: string }) => {
            if (basketId && 'basketId' in basketId) {
              getBasket(basketId.basketId).then((newBasket) => {
                setBasket(newBasket);
              });
            }
          });
      }
    });
  }, []);

  useEffect(() => {
    fetchBasket();
  }, [fetchBasket]);

  useEffect(() => {
    if (!basket) {
      fetchBasket();
    }
  }, [basket, fetchBasket]);

  return basket;
}

export function useAuthUrl(basket: Basket | undefined): undefined | string {
  const [authUrl, setAuthUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (basket) {
      getAuthUrl(
        basket.ident,
        process.env.NODE_ENV == 'development'
          ? 'http://localhost:3000'
          : process.env.SITE_URL ?? 'about:blank'
      ).then((authUrls) => {
        if (authUrls[0]) {
          setAuthUrl(authUrls[0].url);
        }
      });
    }
  }, [basket]);

  return authUrl;
}

export function useWebstoreData(): undefined | Webstore {
  const [webstoreData, setWebstoreData] = useState<undefined | Webstore>(undefined);

  useEffect(() => {
    getWebstoreData().then((newWebstoreData) => setWebstoreData(newWebstoreData));
  }, []);

  return webstoreData;
}

export function usePackageData(packageId: number, basketIdentifier?: string): undefined | Package {
  const [packageData, setPackageData] = useState<Package | undefined>(undefined);

  useEffect(() => {
    getPackage(packageId, basketIdentifier).then((newPackageData) =>
      setPackageData(newPackageData)
    );
  }, [packageId, basketIdentifier]);

  return packageData;
}
