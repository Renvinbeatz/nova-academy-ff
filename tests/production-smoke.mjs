import assert from 'node:assert/strict';

const base = new URL(process.argv[2] ?? 'http://127.0.0.1:3000');
const page = await fetch(base);
assert.equal(page.status, 200);
assert.match(await page.text(), /NØVA Academy/);

const response = await fetch(new URL('/api/course', base));
assert.equal(response.status, 200);
const course = await response.json();
assert.deepEqual(Object.keys(course.content), ['1', '2', '3', '4', '5']);
assert.equal(course.canEdit, false);

const paths = Object.values(course.content).map(lesson => lesson.video);
paths.push('/materials/aula-5/video-apoio-01.mp4', '/materials/aula-5/video-apoio-02.mp4');
for (const path of paths) {
  const media = await fetch(new URL(path, base), {headers: {Range: 'bytes=0-63'}});
  assert.equal(media.status, 206, path);
  assert.match(media.headers.get('content-type') ?? '', /^video\/mp4/, path);
  assert.match(media.headers.get('content-range') ?? '', /^bytes 0-63\/\d+$/, path);
  const bytes = Buffer.from(await media.arrayBuffer());
  assert.equal(bytes.length, 64, path);
  assert.equal(bytes.toString('ascii', 4, 8), 'ftyp', path);

  const tail = await fetch(new URL(path, base), {headers: {Range: 'bytes=-64'}});
  assert.equal(tail.status, 206, path);
  assert.equal((await tail.arrayBuffer()).byteLength, 64, path);
  console.log(`Vídeo acessível com início, fim e busca por intervalo: ${path}`);
}

const legacy = await fetch(new URL('/api/media/video-5-8db08cba-8cd7-4744-bee7-0991cbcec3c4', base), {redirect: 'manual'});
assert.equal(legacy.status, 307);
assert.equal(new URL(legacy.headers.get('location')).pathname, course.content['5'].video);
assert.equal((await fetch(new URL('/api/media/inexistente', base))).status, 404);
assert.equal((await fetch(new URL('/api/upload', base), {method: 'PUT', body: 'test'})).status, 405);
console.log('Página, cinco aulas, dois materiais, links antigos e bloqueio de escrita: OK.');
