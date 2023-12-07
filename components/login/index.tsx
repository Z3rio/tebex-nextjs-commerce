'use server';

import { tryFetchAuthUrl } from './actions';
import LoginModal from './modal';
import OpenLogin from './open-login';

export default async function Login() {
  const authUrl = await tryFetchAuthUrl();

  if (!authUrl) {
    return <OpenLogin />;
  }

  return <LoginModal authLink={authUrl} />;
}
