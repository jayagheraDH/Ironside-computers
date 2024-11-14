import NextHead from 'next/head'
import { DefaultSeo } from 'next-seo'

const Head: any = ({ pageMeta }: any) => {
  const metaConfig = {
    title: pageMeta?.title?.length ? pageMeta?.title : 'Ironside Computers',
    titleTemplate:
      '%s - Prebuilt Custom Gaming Computer & PC Builders – Ironside',
    description: pageMeta?.description?.length
      ? pageMeta?.description?.replace(/<[^>]*>/g, '')
      : 'Prebuilt Custom Gaming Computer & PC Builders – Ironside',
    openGraph: {
      type: 'website',
      locale: 'en_IE',
      url: 'https://ironsidecomputers.com/',
      site_name: 'Ironside Computers',
    },
    twitter: {
      handle: 'Ironside Computers',
      site: 'Ironside Computerstjs',
      cardType: 'summary_large_image',
    },
  }

  return (
    <>
      <DefaultSeo {...metaConfig} />
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" key="site-manifest" />
        <link
          rel="icon"
          type="image/png"
          href="https://cdn.builder.io/api/v1/image/assets%2Ff6d91abf288f4e5fb3b6f1e8b846274b%2Fc5decb19f3d34bf083703069d888c9e9"
        />
      </NextHead>
    </>
  )
}

export default Head
