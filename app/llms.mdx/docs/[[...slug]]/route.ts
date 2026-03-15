import { getLLMText, source } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  // Keep only leaf pages (depth >= 2) to avoid file/directory conflicts
  // in static export. Section index pages (api, sdk, concepts) would
  // produce an extensionless file that collides with the child directory.
  return source.generateParams().filter((p) => p.slug.length >= 2);
}
