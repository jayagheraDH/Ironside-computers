import type { HookFetcher } from '@commerce/utils/types'
import type { SwrOptions } from '@commerce/utils/use-data'
import useCommerceSearch from '@commerce/products/use-search'
import type { SearchProductsData } from '../api/catalog/products'

const defaultOpts = {
  url: '/api/bigcommerce/catalog/products',
  method: 'GET',
}

export type SearchProductsInput = {
  search?: string
  categoryId?: any
  brandId?: number
  sort?: string
  productIn?: string
}

export const fetcher: HookFetcher<SearchProductsData, SearchProductsInput> = (
  options,
  { search, categoryId, brandId, sort, productIn },
  fetch
) => {
  // Use a dummy base as we only care about the relative path
  const url = new URL(options?.url ?? defaultOpts.url, 'http://a')

  if (search) url.searchParams.set('search', search)
  if (categoryId) url.searchParams.set('category', categoryId)
  if (Number.isInteger(brandId)) url.searchParams.set('brand', String(brandId))
  if (sort) url.searchParams.set('sort', sort)
  if (productIn) url.searchParams.set('productIn', productIn)

  return fetch({
    url: url.pathname + url.search,
    method: options?.method ?? defaultOpts.method,
  })
}

export function extendHook(
  customFetcher: typeof fetcher,
  swrOptions?: SwrOptions<SearchProductsData, SearchProductsInput>
) {
  const useSearch = (input: SearchProductsInput = {}) => {
    const response = useCommerceSearch(
      defaultOpts,
      [
        ['search', input.search],
        ['categoryId', input.categoryId],
        ['brandId', input.brandId],
        ['sort', input.sort],
        ['productIn', input.productIn],
      ],
      customFetcher,
      { revalidateOnFocus: false, ...swrOptions }
    )

    return response
  }

  useSearch.extend = extendHook

  return useSearch
}

export default extendHook(fetcher)
