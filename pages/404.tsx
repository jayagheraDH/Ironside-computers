import type { GetStaticPropsContext } from 'next'
import { BuilderComponent } from '@builder.io/react'
import Header from '@components/BuilderHeader/Header'
import React from 'react'
import Link from 'next/link'
import { getConfig } from '@framework/api'
import getAllPages from '@framework/api/operations/get-all-pages'

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  const config = getConfig({ locale })

  const { pages } = await getAllPages({ config, preview })
  return {
    props: {
      pages,
    },
    revalidate: 14400,
  }
}

export default function ErrorPage({ header }: any) {
  if (typeof window !== 'undefined') {
    document.querySelector('#body')?.setAttribute('data-theme', 'dark')
    document.querySelector('html')?.removeAttribute('data-theme')
  }
  return (
    <>
      <Header headerData={header?.data} />
      <div className="box-form absolute-heading 404-page">
        <h1 className="account-heading">404</h1>
        <div className="bg-box">
          <div className="bg-box-head">
            <div className="flex dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <form>
            <div className="box-model">
              <p>Seems the page you’re looking for isn’t here.{'(>_<)'}</p>
              <div className="mt-auto">
                <Link href="/">
                  <button className="btn">Reboot</button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="mt50">
        <BuilderComponent model="symbol" />
      </div>
    </>
  )
}
