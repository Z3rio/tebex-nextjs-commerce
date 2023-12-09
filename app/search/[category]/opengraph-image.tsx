import { getCategory } from '@lib/tebex';
import OpengraphImage from 'components/opengraph-image';

export const runtime = 'edge';

export default async function Image({ params }: { params: { category: string } }) {
  const category = await getCategory(Number(params.category));
  const title = category ? category.name : 'Unknown Name';

  return await OpengraphImage({ title });
}
