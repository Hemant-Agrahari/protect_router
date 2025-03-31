import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/next.svg" />
        <meta name="theme-color" content="#fff" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script>
          {`if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch((error) => {
                console.error('Error during service worker registration:', error);
              });
            });
          }`}
        </script>
      </body>
    </Html>
  )
}
