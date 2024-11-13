import $ from 'jquery'
import { useEffect, useState } from 'react'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import builder, { BuilderComponent } from '@builder.io/react'
import { getConfig } from '@framework/api'
import useSearch from '@framework/products/use-search'
import getAllPages from '@framework/api/operations/get-all-pages'
import { Text } from '@components/ui'
import { Layout } from '@components/common'
import Header from '@components/BuilderHeader/Header'
import { MerchGearProductCard } from '@components/product'
import { trackViewItemList } from '@lib/category-event-script'

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  const config = getConfig({ locale })
  const { pages } = await getAllPages({ config, preview })
  const header = await builder.get('header').toPromise()

  return {
    props: { pages, header },
  }
}

export default function MerchGears({
  header,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [currency, setCurrency] = useState<any>({})
  let transformedData: any[] = []
  const { data } = useSearch({
    categoryId: 208,
  })

  if (typeof window !== 'undefined') {
    document.querySelector('#body')?.setAttribute('data-theme', 'dark')
    document.querySelector('html')?.removeAttribute('data-theme')
  }

  useEffect(() => {
    const currencyData: any = localStorage.getItem('currency_data')
    if (currencyData) setCurrency(JSON.parse(currencyData))
    $(document).on('CURRENCY_UPDATE', () => {
      const currencyData: any = localStorage.getItem('currency_data')
      setCurrency(JSON.parse(currencyData))
    })
  }, [])

  if (data?.found && data?.products?.length) {
    transformedData = data?.products.reduce((result: any, item: any) => {
      const { node } = item
      const { customFields, variants } = node
      const transformed = customFields.edges.reduce(
        (result: any, item: any) => {
          const { node } = item
          if (node.name === 'Order') {
            result[node.name] = node.value
          } else {
            result.edges = result.edges || []
            result.edges.push({ node })
          }
          return result
        },
        {}
      )

      const sizes = transformed?.edges?.map((field: any) => {
        return {
          size: field.node.value,
          productId: node.entityId,
          variantId: variants.edges[0].node.entityId,
          order: transformed.Order,
          isInStock: variants.edges[0].node.inventory.isInStock,
        }
      })
      const nameParts = node.name.split(' - ')
      const baseName = nameParts[0]

      const existingItem = result.find(
        (existing: any) => existing.name === baseName
      )

      if (existingItem) {
        existingItem.sizes = Array.from(
          new Set(existingItem?.sizes?.concat(sizes))
        )
      } else {
        if (sizes) {
          result.push({
            name: baseName,
            path: node.path,
            description: node.description,
            prices: node.prices,
            images: node.images,
            categories: node.categories,
            sizes: sizes,
          })
        } else {
          result.push({
            name: baseName,
            path: node.path,
            description: node.description,
            prices: node.prices,
            images: node.images,
            categories: node.categories,
            productId: node.entityId,
            variantId: node.variants.edges[0].node.entityId,
            isInStock: node.variants.edges[0].node.inventory.isInStock,
          })
        }
      }

      result.forEach((product: any) => {
        if (product.sizes && product.sizes.length > 1) {
          product.sizes.sort(
            (a: { order: string }, b: { order: string }) =>
              parseInt(a.order, 10) - parseInt(b.order, 10)
          )
        }
        return product
      })
      return result
    }, [])
  }
  useEffect(() => {
    if (transformedData && transformedData.length > 0) {
      trackViewItemList(transformedData)
    }
  }, [transformedData])

  return (
    <div className="account-page remove-sticky-header">
      <Header headerData={header?.data} />
      <div className="account-pages maxw-260">
        <div className="account-pages-heading gm-heading d-flex align-v-center justify-space">
          <Text variant="pageHeading">Merch</Text>
        </div>
        <div className="mt50">
          {data ? (
            <div className="card-grid flex flex-wrap">
              {transformedData?.map((node: any, index: number) => (
                <div key={index} className="card">
                  <MerchGearProductCard
                    productsData={node}
                    key={node?.path}
                    className="animated fadeIn"
                    imgWidth={318}
                    imgHeight={367}
                    currency={currency}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="content-flex w-100">
              <span className="loader"></span>
            </div>
          )}
        </div>
        <div className="mt50">
          <BuilderComponent model="symbol" />
        </div>
      </div>
    </div>
  )
}

MerchGears.Layout = Layout
