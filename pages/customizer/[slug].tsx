import $ from 'jquery'
import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { Layout } from '@components/common'
import Customizer from '@components/Customizer'
import { getConfig } from '@framework/api'
import getProduct from '@framework/api/operations/get-product'
import getAllPages from '@framework/api/operations/get-all-pages'
import getAllProductPaths from '@framework/api/operations/get-all-product-paths'
import builder from '@builder.io/react'
import getSiteInfo from '@framework/api/operations/get-site-info'
import useSearch from '@framework/products/use-search'
import Header from '@components/BuilderHeader/Header'
import { useEffect, useState } from 'react'

export async function getStaticProps({
  params,
  locale,
  preview,
}: GetStaticPropsContext<{ slug: string }>) {
  const config = getConfig({ locale })

  const { pages } = await getAllPages({ config, preview })
  const { product } = await getProduct({
    variables: { slug: params!.slug },
    config,
    preview,
  })
  const { categories } = await getSiteInfo({ config, preview })
  const header = await builder.get('header').toPromise()
  let optionsCategories: any[] = []
  categories?.filter((ele) => {
    if (ele.entityId === 70) {
      optionsCategories.push({
        category: 'Aesthetics',
        productCategories: ele.children,
      })
    }
    if (ele.entityId === 95) {
      optionsCategories.push({
        category: 'Components',
        productCategories: ele.children,
      })
    }
    if (ele.entityId === 112) {
      optionsCategories.push({
        category: 'Services',
        productCategories: ele.children,
      })
    }
    if (ele.entityId === 113) {
      optionsCategories.push({
        category: 'Peripherals',
        productCategories: ele.children,
      })
    }
  })

  if (!product) {
    throw new Error(`Product with slug '${params!.slug}' not found`)
  }

  return {
    props: { pages, product, optionsCategories, header },
    revalidate: 200,
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const { products } = await getAllProductPaths()
  return {
    paths: locales
      ? locales.reduce<string[]>((arr, locale) => {
          // Add a product path for every locale
          products?.forEach((product) => {
            arr.push(`/${locale}/customizer${product.node.path}`)
          })
          return arr
        }, [])
      : products?.map((product) => `/customizer${product.node.path}`),
    fallback: 'blocking',
  }
}

export default function Slug({
  product,
  optionsCategories,
  header,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [productDetail, setProductDetail] = useState(product)
  const [themeColor, setThemeColor] = useState(false)
  const [groupedProducts, setGroupedProducts] = useState<any[]>([])
  const [colorOpts, setColorOpts] = useState<any[]>([])
  const [currency, setCurrency] = useState<any>({})
  let productsFetched = 0

  const productData = useSearch({
    search: `${productDetail?.entityId}`,
    sort: '',
  })

  const { data: colorOptions } = useSearch({
    categoryId: 209,
  })

  optionsCategories?.forEach((category: any) => {
    const uniqueValueIds = new Set(
      category?.productCategories?.map((item: any) => item.entityId)
    )
    const commaSeparatedString = Array.from(uniqueValueIds).join(',')
    const products = useSearch({
      categoryId: commaSeparatedString,
    })
    if (products?.data?.found) {
      productsFetched++
      category?.productCategories?.forEach((subs: any) => {
        let catProds: any = []
        products?.data?.products?.map((prods: any) => {
          const mouseNode = prods?.node?.categories?.edges.find(
            (item: any) => item.node.name === subs?.name
          )
          if (mouseNode) {
            catProds.push(prods)
          }
        })
        if (catProds?.length) subs.products = catProds
      })
    }
  })

  const groupProductsByCategory = (originalData: any) => {
    const groupedData: any[] = []
    const categoryMap: any = {}

    originalData?.forEach((categoryItem: any) => {
      const groupedCategoryItem: any = {
        categoryName: categoryItem?.categoryName,
        subCategory: [],
      }

      categoryItem?.subCategories?.forEach((subCategoryItem: any) => {
        const categoryName = subCategoryItem?.categoryName
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = []
        }
        categoryMap[categoryName].push(subCategoryItem?.products)
      })

      for (const [categoryName, products] of Object.entries(categoryMap)) {
        const hasCaseCategory = categoryItem.subCategories.some(
          (subCategory: any) => subCategory.categoryName === categoryName
        )
        if (hasCaseCategory) {
          const subCategoryObject: any = {
            categoryName: categoryName,
            products: products,
          }
          groupedCategoryItem?.subCategory?.push(subCategoryObject)
        }
      }
      groupedData.push(groupedCategoryItem)
    })
    if (colorOptions?.found && colorOptions?.products?.length) {
      const options: any = colorOptions?.products?.map((prods: any) => {
        return prods?.node
      })
      setColorOpts(options)
    }
    setGroupedProducts(groupedData)
  }
  const checkThemeColor = (dark: boolean) => {
    if (dark == true) {
      document.querySelector('#body')?.setAttribute('data-theme', 'light')
      setThemeColor(true)
    } else {
      setThemeColor(false)
      document.querySelector('#body')?.setAttribute('data-theme', 'dark')
    }
  }

  if (typeof window !== 'undefined') {
    document.querySelector('html')?.removeAttribute('data-theme')
  }

  useEffect(() => {
    let filteredProductData: any = []
    const optionsProduct =
      productData.data?.products[0]?.node?.productOptions?.edges
    if (optionsProduct) {
      setTimeout(() => {
      optionsCategories?.forEach((data: any) => {
        data?.productCategories?.forEach((category: any) => {
          if (category?.products?.length) {
            category.products.forEach((productCat: any) => {
              optionsProduct?.forEach((ele: any) => {
                data?.category,
                  ele?.node?.values?.edges?.forEach((filterProduct: any) => {
                    if (
                      productCat.node.entityId === filterProduct.node.productId
                    ) {
                      filteredProductData.push({
                        category: data?.category,
                        subCategories: [
                          {
                            categoryName: category?.name,
                            products: productCat.node,
                          },
                        ],
                      })
                    }
                  })
              })
            })
          }
        })
      })

      const categoriesDataFiltered = (filteredProductData || []).reduce(
        (
          accumulator: { categoryName: any; subCategories: any[] }[],
          item: { category: any; subCategories: any }
        ) => {
          const { category, subCategories } = item
          const existingCategory = accumulator.find(
            (existingCategory: { categoryName: any }) =>
              existingCategory.categoryName === category
          )

          if (existingCategory) {
            existingCategory.subCategories?.push(subCategories[0])
          } else {
            accumulator.push({
              categoryName: category,
              subCategories: [subCategories[0]],
            })
          }

          return accumulator
        },
        []
      )

      if (categoriesDataFiltered.length) {
        const filteredSubCategories: any[] = []
        const productCats = Object.assign({}, productDetail)
        categoriesDataFiltered?.forEach((cat: any) => {
          let sortedSubCats: any[] = []
          productCats?.productOptions?.edges?.forEach((opts: any) => {
            opts?.node?.values?.edges?.forEach((prod: any) => {
              cat?.subCategories?.forEach((subs: any) => {
                if (subs?.categoryName === opts?.node?.displayName) {
                  if (prod?.node?.productId === subs?.products?.entityId) {
                    sortedSubCats.push({
                      categoryName: subs?.categoryName,
                      products: subs?.products,
                    })
                  }
                }
              })
            })
          })
          filteredSubCategories.push({
            categoryName: cat?.categoryName,
            subCategories: sortedSubCats,
          })
        })
        setProductDetail(productCats)
        groupProductsByCategory(filteredSubCategories)
      }
      // setCategories(manipulateCats)
      }, 800)
    }
  }, [productsFetched, productData.data, colorOptions])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.querySelector('#body')?.setAttribute('data-theme', 'dark')
      document.querySelector('html')?.removeAttribute('data-theme')
    }
    const currencyData: any = localStorage.getItem('currency_data')
    if (currencyData) setCurrency(JSON.parse(currencyData))
    $(document).on('CURRENCY_UPDATE', () => {
      const currencyData: any = localStorage.getItem('currency_data')
      setCurrency(JSON.parse(currencyData))
    })
  }, [])

  return (
    <div>
      <Header headerData={header?.data} />
      {groupedProducts && (
        <Customizer
          productsFetched={optionsCategories?.length}
          product={productDetail}
          categoriesDataFiltered={groupedProducts}
          checkThemeColor={checkThemeColor}
          themeColor={themeColor}
          colorOpts={colorOpts}
          currency={currency}
        />
      )}
      {/* <div className="mt50">
        <BuilderComponent model="symbol" />
      </div> */}
    </div>
  )
}

Slug.Layout = Layout
