import {continueRender, delayRender, staticFile} from 'remotion';

// 로컬 폰트 파일을 FontFace API 로 올리고, 다 올라갈 때까지 렌더를 붙잡아 둔다.
const FACES: [family: string, file: string, weight: string][] = [
  ['Paperlogy', 'fonts/Paperlogy-5Medium.ttf', '500'],
  ['Paperlogy', 'fonts/Paperlogy-7Bold.ttf', '700'],
  ['Paperlogy', 'fonts/Paperlogy-8ExtraBold.ttf', '800'],
  ['Paperlogy', 'fonts/Paperlogy-9Black.ttf', '900'],
  ['Pretendard', 'fonts/PretendardVariable.ttf', '100 900'],
  ['Noto Serif KR', 'fonts/NotoSerifKR-Light.otf', '300'],
  ['Noto Serif KR', 'fonts/NotoSerifKR-Regular.otf', '400'],
  ['Noto Serif KR', 'fonts/NotoSerifKR-Bold.otf', '700'],
  ['Noto Serif KR', 'fonts/NotoSerifKR-Black.otf', '900'],
  ['JetBrains Mono', 'fonts/JetBrainsMono.ttf', '100 800'],
];

const handle = delayRender('fonts');
Promise.all(
  FACES.map(([family, file, weight]) =>
    new FontFace(family, `url(${staticFile(file)})`, {weight}).load().then((f) => {
      (document.fonts as unknown as Set<FontFace>).add(f);
    }),
  ),
)
  .then(() => continueRender(handle))
  .catch((e) => {
    console.error(e);
    continueRender(handle);
  });
