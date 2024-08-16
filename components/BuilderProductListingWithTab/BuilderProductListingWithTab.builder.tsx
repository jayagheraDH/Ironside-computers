import { Builder } from '@builder.io/react'

import BuilderProductListingWithTab from './BuilderProductListingWithTab'

export const BuilderProductListingWithTabConfig = {
  name: 'ProductListingWithTab',
  inputs: [
    {
      name: 'productlistingWithTab',
      type: 'reference',
    },
  ],
}
Builder.registerComponent(
  BuilderProductListingWithTab,
  BuilderProductListingWithTabConfig
)
