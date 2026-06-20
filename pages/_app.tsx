import type { AppProps } from 'next/app';
import { CacheProvider, type EmotionCache } from '@emotion/react';
import createEmotionCache from '../lib/createEmotionCache';
import { display, body } from '../lib/fonts';

const clientSideEmotionCache = createEmotionCache();

type MyAppProps = AppProps & {
  emotionCache?: EmotionCache;
};

export default function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      {/* display:contents keeps the layout/height chain intact while still
          exposing the --font-* variables to every descendant. */}
      <div className={`${display.variable} ${body.variable}`} style={{ display: 'contents' }}>
        <Component {...pageProps} />
      </div>
    </CacheProvider>
  );
}
