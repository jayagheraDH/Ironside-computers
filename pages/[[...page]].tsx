import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react'
// loading widgets dynamically to reduce bundle size, will only be included in bundle when is used in the content
import '@builder.io/widgets/dist/lib/builder-widgets-async'
import { Layout } from '@components/common'
import ErrorPage from './404'
import { Head } from '@components/common'

builder.init('f6d91abf288f4e5fb3b6f1e8b846274b')

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ page: string[] }>) {
  const header = await builder.get('header').toPromise()
  const page =
    (await builder
      .get('page', {
        userAttributes: {
          urlPath: '/' + (params?.page?.join('/') || ''),
        },
      })
      .toPromise()) || null

  return {
    props: {
      page,
      header,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 5 seconds
    revalidate: 15,
  }
}

export async function getStaticPaths() {
  const pages = await builder.getAll('page', {
    options: { noTargeting: true },
    omit: 'data.blocks',
  })

  return {
    paths: pages.map((page) => `${page.data?.url}`),
    fallback: true,
  }
}

export default function Page({
  page,
  header,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const isPreviewingInBuilder = useIsPreviewing()
  const show404 = !page && !isPreviewingInBuilder

  if (typeof window !== 'undefined') {
    document
      .querySelector('#body')
      ?.setAttribute(
        'data-theme',
        page?.data?.blackTheme == false ? 'light' : 'dark'
      )
    document.querySelector('html')?.removeAttribute('data-theme')
  }

  if (router.isFallback) {
    return (
      <div className="fallback-loader">
        <span className="loader"></span>
      </div>
    )
  }
  return (
    <>
      <Head pageMeta={page?.data} />
      {show404 ? (
        <ErrorPage header={header} />
      ) : (
        <BuilderComponent model="page" content={page} />
      )}
    </>
  )
}

Page.Layout = Layout
