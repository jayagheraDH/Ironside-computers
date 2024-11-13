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
          {/* Google Tag Manager */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': 
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NPB6KRVW');`,
            }}
          ></script>
          {/* End Google Tag Manager */}

          {/* Global site tag (gtag.js) */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-0V72S5SKRG"
          ></script>

          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0V72S5SKRG');
            gtag('config', 'AW-1013590581');
          `,
            }}
          ></script>

          {/* Meta Pixel Code */}
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '636945451322342'); 
          fbq('track', 'PageView');`,
            }}
          ></script>
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
            fetchpriority="high"
          ></link>
        </Head>
        <body className="loading" id="body">
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-NPB6KRVW"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          {/* End Google Tag Manager (noscript) */}

          {/* Meta Pixel Code (noscript) */}
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=636945451322342&ev=PageView&noscript=1"
              alt="Meta Pixel"
            />
          </noscript>
          {/* End Meta Pixel Code (noscript) */}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
