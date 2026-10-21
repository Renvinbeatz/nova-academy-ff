import {copyFile, mkdir, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const source = new URL('../videos-originais/', import.meta.url);
const destination = new URL('../public/videos/', import.meta.url);
await mkdir(destination, {recursive: true});

for (let lesson = 1; lesson <= 5; lesson++) {
  const name = `aula-${String(lesson).padStart(2, '0')}.mp4`;
  const input = new URL(name, source);
  const info = await stat(input).catch(() => {
    throw new Error(`Falta o vídeo da aula ${lesson}: ${fileURLToPath(input)}`);
  });
  if (!info.isFile() || info.size === 0) throw new Error(`O vídeo ${name} está vazio ou inválido.`);
  await copyFile(input, new URL(name, destination));
}

console.log('As cinco aulas foram preparadas em public/videos.');
