import type { ReactElement } from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentInitialProps,
} from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '../lib/createEmotionCache';

type MyDocumentProps = DocumentInitialProps & {
  emotionStyleTags: ReactElement[];
};

export default class MyDocument extends Document<MyDocumentProps> {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content="#0A0418" />
          <meta
            name="description"
            content="Random word game to simulate improv comedy for virtually connected teams."
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Improvised word game" />
          <meta
            property="og:description"
            content="Guess the mind. Justify the chaos. A party word-improv game for teams."
          />
          <meta property="og:url" content="https://improvised-word.surge.sh/" />
          <meta name="twitter:card" content="summary" />
          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// Inject the emotion critical CSS into the server-rendered HTML so the page
// arrives styled instead of flashing unstyled before hydration.
MyDocument.getInitialProps = async (
  ctx: DocumentContext,
): Promise<MyDocumentProps> => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return { ...initialProps, emotionStyleTags };
};
