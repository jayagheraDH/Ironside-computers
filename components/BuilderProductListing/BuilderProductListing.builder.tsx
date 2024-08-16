import { Builder } from '@builder.io/react'

import BuilderProductListing from './BuilderProductListing';

export const BuilderProductListingConfig = {
  name: 'ProductListing',
  inputs: [
    {
      name: 'productlisting',
      type: 'reference',
    },
  ],
}
Builder.registerComponent(BuilderProductListing, BuilderProductListingConfig)