# NØVA Academy

Mini curso Do 0 ao Influencer de FF. Next.js, React e TypeScript, preparado para Vercel.

## Desenvolvimento

Use Node.js 22.x e pnpm 11.25.0. Execute `pnpm install`, depois `pnpm dev`.
Para produção, execute `pnpm build` e `pnpm start`.
Os testes existentes usam `node --experimental-strip-types --test tests/*.test.mjs`.
Com o servidor de produção em execução, verifique a API e os sete vídeos com `node tests/production-smoke.mjs http://127.0.0.1:3000`.

## Vercel

Importe este repositório usando o framework Next.js. O comando de build é `pnpm run build` e a saída é `.next`, definidos também em `vercel.json`.
O build usa Next.js de fato; o antigo comando Vinext gerava `dist/` e provocava NEXT_NO_ROUTES_MANIFEST na Vercel.

## Conteúdo das aulas

Os cinco vídeos principais estão em `videos-originais/aula-01.mp4` até `aula-05.mp4`.
Os comandos dev/build copiam esses arquivos para `public/videos/`, sem duplicá-los no Git.
`data/course.json` associa cada aula ao seu vídeo. A API `/api/course` publica esse conteúdo sem depender de Cloudflare Workers, R2 ou autenticação ChatGPT.
Os dois materiais de apoio da aula 5 permanecem em `public/materials/aula-5/`, referenciados por `lib/materials.ts`.
Para atualizar uma aula, substitua o MP4 no repositório e publique novamente. Links HTTPS diretos também podem ser usados no campo video de `data/course.json`.

A versão Vercel é de leitura: o gerenciador de uploads do Sites dependia de R2 e da identidade ChatGPT. O botão é ocultado e o endpoint rejeita alterações. Para adicionar uploads duráveis pela interface na Vercel, será necessário integrar armazenamento e autenticação próprios; não se deve gravar vídeos no disco temporário das Functions.

## Versão anterior

Os arquivos auxiliares de Sites/Cloudflare são mantidos como referência e não executados pelo build Next.js. O site original no domínio chatgpt.site continua separado deste repositório.
