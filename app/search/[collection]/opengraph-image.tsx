import { getCategory } from '@lib/tebex';
import OpengraphImage from 'components/opengraph-image';

export const runtime = 'edge';

export default async function Image({ params }: { params: { collection: string } }) {
  const collection = await getCategory(Number(params.collection));
  const title = collection ? collection.name : 'Unknown Name';

  return await OpengraphImage({ title });
}
