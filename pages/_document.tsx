import Document, { Head, Html, Main, NextScript } from 'next/document'
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preload" href="https://fonts.googleapis.com" />
          <link rel="preload" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <script
            id="gorgias-chat-widget-install-v3"
            src="https://config.gorgias.chat/bundle-loader/01HRAD3WX0M4BTPHD30B6N6E39"
          ></script>
          <script src="https://connect-preview.breadpayments.com/sdk.js"></script>
          <link
            rel="preload"
            href="/static/media/FakeReceipt-Regular.08298548.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
            fetchPriority="high"
          ></link>
        </Head>
        <body className="loading" id="body">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
