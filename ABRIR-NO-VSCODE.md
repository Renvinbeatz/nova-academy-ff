# NØVA Academy — pacote completo

## Abrir no VS Code

1. Espere o download terminar e extraia todo o ZIP.
2. Abra a pasta nova-academy-ff no VS Code ou abra nova-academy-ff.code-workspace.
3. Instale Node.js 22.13 ou superior e a versão de pnpm indicada em package.json.
4. No terminal dessa pasta, execute pnpm install e depois pnpm dev.
5. Para gerar o build, execute pnpm build.

## Conteúdo

Este ZIP reúne o código completo, configurações, lockfile, testes, logo e miniaturas.
Os cinco vídeos principais estão em videos-originais/aula-01.mp4 até aula-05.mp4.
Os dois vídeos de apoio da aula 5 estão em public/materials/aula-5/.
Não inclui dependências instaladas, caches, builds, histórico Git ou credenciais.

## Vídeos no ambiente de execução

O backend atual usa Cloudflare Workers e R2 com o binding BUCKET. Os vídeos principais e os registros de aula ficam no bucket do ambiente publicado. Incluir os arquivos no ZIP não transfere automaticamente esses dados nem configura um novo bucket.
Configure o armazenamento e a autenticação no destino e use Gerenciar conteúdo para anexar os cinco arquivos de videos-originais às respectivas aulas.
Os dois materiais da aula 5 já são arquivos estáticos referenciados pelo código.
O README original descreve os bindings e a identidade simulada no ambiente local.

## Hospedagem

O projeto usa Vinext e está configurado para Sites/Cloudflare. Ainda não foi migrado para Vercel: é necessário adaptar o backend, a autenticação e o build/runtime antes de implantar lá.
O arquivo .openai/hosting.json identifica o site original. Configure um novo destino antes de uma implantação independente.
Não publique segredos no repositório. Mantenha os vídeos principais em armazenamento de mídia separado ao enviar o código ao GitHub.

## Integridade

ZIP padrão, sem senha, sem divisão e com método Stored.
O arquivo foi testado por extração e comparação de hashes.
MANIFESTO-SHA256.txt lista o hash dos arquivos extraídos.
