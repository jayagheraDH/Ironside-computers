import { Builder } from '@builder.io/react'

import BuilderVideoTextBanner from './BuilderVideoTextBanner'

export const BuilderVideoTextBannerConfig = {
  name: 'Video With Desc',
  inputs: [
    {
      name: 'posterVideo',
      type: 'file',
    },
    {
      name: 'video',
      type: 'file',
    },
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'creativeTeam',
      type: 'file',
    },
  ],
}
Builder.registerComponent(BuilderVideoTextBanner, BuilderVideoTextBannerConfig)
