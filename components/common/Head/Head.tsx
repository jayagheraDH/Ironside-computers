import { FC } from 'react'
import NextHead from 'next/head'
import { DefaultSeo } from 'next-seo'
import config from '@config/seo.json'

const Head: FC = () => {
  return (
    <>
      <DefaultSeo {...config} />
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" key="site-manifest" />
        <link
          rel="icon"
          type="image/png"
          href="https://cdn.builder.io/api/v1/image/assets%2Ff6d91abf288f4e5fb3b6f1e8b846274b%2Ff14ecacb59434c8c97ffc9c1aa5cfde4"
        />
      </NextHead>
    </>
  )
}

export default Head
