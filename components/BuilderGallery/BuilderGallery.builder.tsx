import { Builder } from '@builder.io/react'

import BuilderGallery from './BuilderGallery'

export const BuilderGalleryConfig = {
  name: 'Gallery',
  inputs: [
    {
      name: 'gallery',
      type: 'reference',
    },
  ],
}
Builder.registerComponent(BuilderGallery, BuilderGalleryConfig)
