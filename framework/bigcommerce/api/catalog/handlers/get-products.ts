import getAllProducts, { ProductEdge } from '../../operations/get-all-products'
import type { ProductsHandlers } from '../products'

const SORT: { [key: string]: string | undefined } = {
  latest: 'id',
  trending: 'total_sold',
  price: 'price',
}
const LIMIT = 50

// Return current cart info
const getProducts: ProductsHandlers['getProducts'] = async ({
  res,
  body: { search, category, brand, sort, productIn },
  config,
}) => {
  // Use a dummy base as we only care about the relative path
  const url = new URL('/v3/catalog/products', 'http://a')

  url.searchParams.set('is_visible', 'true')
  url.searchParams.set('limit', String(LIMIT))

  if (search) url.searchParams.set('keyword', search)
  if (productIn) url.searchParams.set('id:in', productIn)

  if (category)
    url.searchParams.set('categories:in', category)

  if (brand && Number.isInteger(Number(brand)))
    url.searchParams.set('brand_id', brand)

  if (sort) {
    const [_sort, direction] = sort.split('-')
    const sortValue = SORT[_sort]

    if (sortValue && direction) {
      url.searchParams.set('sort', sortValue)
      url.searchParams.set('direction', direction)
    }
  }

  // We only want the id of each product
  url.searchParams.set('include_fields', 'id')

  const { data, meta } = await config.storeApiFetch<{ data: { id: number }[], meta: any }>(
    url.pathname + url.search
  )
  const totalPages = meta?.pagination?.total_pages
  const entityIds = data.map((p) => p.id)
  const found = entityIds.length > 0
  // We want the GraphQL version of each product
  const graphqlData = await getAllProducts({
    variables: { first: LIMIT, entityIds },
    config,
  })
  // Put the products in an object that we can use to get them by id
  const productsById = graphqlData.products.reduce<{
    [k: number]: ProductEdge
  }>((prods, p) => {
    prods[p.node.entityId] = p
    return prods
  }, {})
  const products: ProductEdge[] = found ? [] : graphqlData.products
  if (totalPages > 1) {
    let prodData = [...graphqlData?.products]
    let paginatedEntityIds: any[] = []
    let current_page = 2;
    while (current_page <= totalPages) {
      url.searchParams.set('page', String(current_page))
      const { data } = await config.storeApiFetch<{ data: { id: number }[], meta: any }>(
        url.pathname + url.search
      )
      const entityIds = data.map((p) => p.id)
      const paginatedProducts = await getAllProducts({
        variables: { first: LIMIT, entityIds },
        config,
      })
      paginatedEntityIds = [...paginatedEntityIds, ...entityIds]
      prodData = [...prodData, ...paginatedProducts?.products]
      current_page++
    }
    if (current_page > totalPages) {
      res.status(200).json({ data: { products: prodData, found } })
    }
  } else {
    // Populate the products array with the graphql products, in the order
    // assigned by the list of entity ids
    entityIds.forEach((id) => {
      const product = productsById[id]
      if (product) products.push(product)
    })
    res.status(200).json({ data: { products, found } })
  }

}

export default getProducts
