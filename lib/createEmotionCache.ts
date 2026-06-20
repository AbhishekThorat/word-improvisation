import createCache, { type EmotionCache } from '@emotion/cache';

// `prepend: true` keeps MUI styles ahead of other styles so they can be
// overridden, and a shared cache lets us extract critical CSS during SSR.
export default function createEmotionCache(): EmotionCache {
  return createCache({ key: 'css', prepend: true });
}
