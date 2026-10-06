// 한 번 번들한 뒤 지정 프레임들을 스틸로 뽑고 접촉 인화(contact sheet)를 만든다.
// 사용법: node scripts/stills.mjs <CompositionId> <frame,frame,...> [outDir]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const [id, framesArg, outDirArg] = process.argv.slice(2);
const frames = framesArg.split(',').map(Number);
const outDir = outDirArg ?? path.resolve('out/stills', id);
fs.mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id});
const files = [];
for (const frame of frames) {
  const output = path.join(outDir, `${id}-${String(frame).padStart(4, '0')}.jpg`);
  await renderStill({composition, serveUrl, output, frame, imageFormat: 'jpeg', jpegQuality: 85, scale: 0.5});
  files.push(output);
  console.log('still', frame);
}
const sheet = path.join(outDir, `${id}-sheet-${frames[0]}-${frames.at(-1)}.jpg`);
try {
  execFileSync('magick', ['montage', ...files, '-font', '/System/Library/Fonts/Helvetica.ttc', '-tile', '4x', '-geometry', '480x270+4+4', '-background', '#222', sheet], {stdio: 'ignore'});
} catch {
  // 폰트 경고로 종료 코드가 1이어도 결과물이 생기면 그대로 쓴다
}
console.log(sheet);
