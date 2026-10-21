export function PUT() {
  return Response.json(
    {error: 'Nesta hospedagem, atualize os vídeos pelo repositório e publique novamente.'},
    {status: 405},
  );
}
