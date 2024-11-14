import '@assets/styles/main.css'
import '@assets/styles/app.scss'
import 'keen-slider/keen-slider.min.css'
import '@assets/styles/chrome-bug.css'

import { FC, useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { builder } from '@builder.io/react'

import { ManagedUIContext } from '@components/ui/context'
import { Head } from '@components/common'
import '../components/BuilderProductBox/ProductBox.builder'
import '../components/BuilderCustomizer/Customizer.builder'
import '../components/BuilderHeader/Header.builder'
import '../components/BuilderCategoryHeader/CategoryHeader.builder'
import '../components/BuilderGallery/BuilderGallery.builder'
import '../components/BuilderProductListing/BuilderProductListing.builder'
import '../components/BuilderProductCard/ProductCard.builder'
import '../components/BuilderProductPageBanner/BuilderProductPageBanner.builder'
import '../components/BuilderProductListingWithTab/BuilderProductListingWithTab.builder'
import '../components/BuilderVideoTextBanner/BuilderVideoTextBanner.builder'
import '../components/BuilderForgePcCard/BuilderForgePcCard.builder'
import { SmoothScroll } from '@components/ui'

const Noop: FC = ({ children }) => <>{children}</>

builder.init('f6d91abf288f4e5fb3b6f1e8b846274b')

export default function MyApp({ Component, pageProps }: any) {
  const Layout = (Component as any).Layout || Noop
  const [windowWidth, setWindowWidth] = useState<number>(1920)

  useEffect(() => {
    document.body.classList?.remove('loading')
    setWindowWidth(window.outerWidth)
  }, [])
  const pageMeta = {
    title: pageProps?.product?.name || pageProps?.page?.data?.title,
    description:
      pageProps?.product?.description?.replace(/<[^>]*>/g, '') ||
      pageProps?.page?.data?.description,
  }

  return (
    <>
      <Head pageMeta={pageMeta} />
      <ManagedUIContext>
        {windowWidth >= 1023 ? (
          <Layout pageProps={pageProps}>
            <SmoothScroll>
              <Component {...pageProps} />
            </SmoothScroll>
          </Layout>
        ) : (
          <Layout pageProps={pageProps}>
            <SmoothScroll>
              <Component {...pageProps} />
            </SmoothScroll>
          </Layout>
        )}
      </ManagedUIContext>
    </>
  )
}
