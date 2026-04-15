import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const SRC = '/home/tunix/Escritorio/imagenes_tunix';
const OUT_BASE = '/home/tunix/Escritorio/Tunixlabsweb/public/cases';
const ALIASES = { erp: 'fernandez', speackly: 'speakly' };
const RE = /^([a-z]+?)(\d+)\.(png|jpe?g)$/i;

const files = (await fs.readdir(SRC)).sort();
let processed = 0;
for (const file of files) {
  const m = file.match(RE);
  if (!m) { console.log('SKIP:', file); continue; }
  const rawName = m[1].toLowerCase();
  const idx = m[2];
  const slug = ALIASES[rawName] ?? rawName;
  const outDir = path.join(OUT_BASE, slug);
  await fs.mkdir(outDir, { recursive: true });
  const outWebp = path.join(outDir, `${idx.padStart(2, '0')}.webp`);
  const input = path.join(SRC, file);
  await sharp(input).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(outWebp);
  const blurBuf = await sharp(input).resize(20).blur(1).webp({ quality: 20 }).toBuffer();
  const blurDataURL = `data:image/webp;base64,${blurBuf.toString('base64')}`;
  await fs.writeFile(`${outWebp}.blur.json`, JSON.stringify({ blurDataURL }, null, 2));
  const stat = await fs.stat(outWebp);
  console.log('PROCESSED:', file, '->', outWebp, stat.size, 'bytes');
  processed++;
}
console.log('TOTAL_PROCESSED:', processed);
