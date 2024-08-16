export const productPrices = /* GraphQL */ `
  fragment productPrices on Prices {
    price {
      value
      currencyCode
    }
    salePrice {
      value
      currencyCode
    }
    retailPrice {
      value
      currencyCode
    }
  }
`

export const swatchOptionFragment = /* GraphQL */ `
  fragment swatchOption on SwatchOptionValue {
    isDefault
    hexColors
  }
`

export const multipleChoiceOptionFragment = /* GraphQL */ `
  fragment multipleChoiceOption on MultipleChoiceOption {
    entityId
      displayName       
        values{
          edges{
            node{
              label                  
                ... on ProductPickListOptionValue{
                  entityId
                  label
                  productId
                  isDefault
                }
            }
          }
        }        
  }
`
export const textFieldOptionFragment = /* GraphQL */ `
  fragment textFieldOption on TextFieldOption {
    entityId
      displayName  
      defaultValue      
  }
`
export const productInfoFragment = /* GraphQL */ `
  fragment productInfo on Product {
    entityId
    name
    path
    brand {
      entityId
    }
    description
    prices {
      ...productPrices
    }
    images {
      edges {
        node {
          urlOriginal
          altText
          isDefault
        }
      }
    }
    variants {
      edges {
        node {
          prices{
            price{
              value
            }
          }
          sku          
          inventory{
            isInStock
          }
          options{
            edges{
              node{
                displayName
                values{
                  edges{
                    node{
                      label
                    }
                  }
                }
              }
            }
          }
          entityId
          defaultImage {
            urlOriginal
            altText
            isDefault
          }
        }
      }
    }
    productOptions {
      edges {
        node {
          __typename
          entityId
          displayName
          ...multipleChoiceOption
          ...textFieldOption
        }
      }
    }
    categories {
      edges {
        node {
          id
          name
        }
      }
    }
    customFields {
      edges {
        node {
          entityId
          name
          value
        }
      }
    }
    localeMeta: metafields(namespace: $locale, keys: ["name", "description"])
      @include(if: $hasLocale) {
      edges {
        node {
          key
          value
        }
      }
    }
  }

  ${productPrices}
  ${multipleChoiceOptionFragment}
  ${textFieldOptionFragment}
`

export const productConnectionFragment = /* GraphQL */ `
  fragment productConnnection on ProductConnection {
    pageInfo {
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        ...productInfo
      }
    }
  }

  ${productInfoFragment}
`
