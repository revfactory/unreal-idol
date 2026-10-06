import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {Promo} from './promo/Promo';
import {Harness} from './harness/Harness';
import {FPS, H, W} from './lib/theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Promo" component={Promo} durationInFrames={1800} fps={FPS} width={W} height={H} />
    <Composition id="Harness" component={Harness} durationInFrames={1800} fps={FPS} width={W} height={H} />
  </>
);
