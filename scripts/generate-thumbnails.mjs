import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PHOTOS_DIR = path.join(__dirname, '..', 'public', 'photos');
const THUMBS_DIR = path.join(PHOTOS_DIR, 'thumbs');

async function main() {
  if (!fs.existsSync(THUMBS_DIR)) {
    fs.mkdirSync(THUMBS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(PHOTOS_DIR)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .sort();

  console.log(`为 ${files.length} 张图片生成缩略图...\n`);

  for (const file of files) {
    const src = path.join(PHOTOS_DIR, file);
    const dst = path.join(THUMBS_DIR, file);

    await sharp(src)
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: 75, progressive: true })
      .toFile(dst);

    const origSize = fs.statSync(src).size;
    const thumbSize = fs.statSync(dst).size;
    const ratio = ((1 - thumbSize / origSize) * 100).toFixed(0);
    console.log(`  ${file}: ${(origSize / 1024 / 1024).toFixed(1)}MB -> ${(thumbSize / 1024 / 1024).toFixed(1)}MB (缩小 ${ratio}%)`);
  }

  console.log('\n完成！');
}

main().catch(err => {
  console.error('失败:', err);
  process.exit(1);
});
