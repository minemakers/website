/** Serves every map ZIP from src/assets/maps/<slug>/zip/ at /downloads/<slug>-<name>.zip. */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getMaps } from '~/lib/maps';
import { getDownloads, readDownload } from '~/lib/files';

export const getStaticPaths = (async () => {
  const { all } = await getMaps();
  return all.flatMap((map) =>
    getDownloads(map.id).map((dl) => ({ params: { file: dl.publicName }, props: { slug: map.id, source: dl.file } })),
  );
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(readDownload(props.slug, props.source), {
    headers: { 'Content-Type': 'application/zip' },
  });
