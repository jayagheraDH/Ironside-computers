import { Builder } from '@builder.io/react'

import BuilderProductPageBanner from './BuilderProductPageBanner'

export const BuilderProductPageBannerConfig = {
  name: 'Product Banner',
  inputs: [
    {
      name: 'banner',
      type: 'reference',
    },
  ],
}
Builder.registerComponent(BuilderProductPageBanner, BuilderProductPageBannerConfig)
