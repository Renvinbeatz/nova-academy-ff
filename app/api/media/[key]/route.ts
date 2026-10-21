const legacyVideos: Record<string, string> = {
  'video-1-5f65a4ea-7765-4a9b-9688-dfb2cebfdb5a': '/videos/aula-01.mp4',
  'video-2-b0466358-5aae-4f21-9768-e697448b5442': '/videos/aula-02.mp4',
  'video-3-01fcd6fc-576d-431c-ac55-7020d96994a3': '/videos/aula-03.mp4',
  'video-4-c781c054-43a5-4ffc-b250-6e85b13049db': '/videos/aula-04.mp4',
  'video-5-8db08cba-8cd7-4744-bee7-0991cbcec3c4': '/videos/aula-05.mp4',
};

export async function GET(request: Request, {params}: {params: Promise<{key: string}>}) {
  const {key} = await params;
  const target = Object.hasOwn(legacyVideos, key) ? legacyVideos[key] : undefined;
  if (!target) return new Response('Arquivo não encontrado.', {status: 404});
  return Response.redirect(new URL(target, request.url), 307);
}
