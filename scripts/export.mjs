// バナーのPNG書き出しと、index.html 用のLPサムネイル撮影
// 実行: npm run export
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const url = (p) => 'file://' + resolve(root, p);

const banners = [
  { name: 'burger-new', width: 1200, height: 628 },
  { name: 'seitai-trial', width: 1080, height: 1080 },
  { name: 'cafe-limited', width: 1200, height: 628 },
];
const lps = ['harbor-bean', 'sango-seitai'];

const browser = await chromium.launch();

for (const { name, width, height } of banners) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(url(`banners/${name}.html`));
  await page.screenshot({ path: resolve(root, `banners/${name}.png`) });
  await page.close();
  console.log(`banners/${name}.png  ${width}x${height}`);
}

for (const name of lps) {
  for (const [suffix, width, height, scale] of [['pc', 1280, 800, 1], ['sp', 390, 844, 2]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
    await page.goto(url(`lp/${name}.html`));
    await page.screenshot({ path: resolve(root, `assets/thumbs/${name}-${suffix}.jpg`), type: 'jpeg', quality: 86 });
    await page.close();
    console.log(`assets/thumbs/${name}-${suffix}.jpg`);
  }
}

await browser.close();
