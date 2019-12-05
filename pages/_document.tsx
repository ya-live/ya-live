import Document, { Html, Head, Main, NextScript } from 'next/document';

class YaLiveDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="stylesheet" href="/lib/antd.min.css" />
          <link rel="stylesheet" href="/common.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default YaLiveDocument;
