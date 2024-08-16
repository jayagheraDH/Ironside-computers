import { Builder } from '@builder.io/react';

import ProductBox from './ProductBox';

export const ProductBoxBuilderConfig = {
  name: 'Product Box',
  image: 'https://cdn.builder.io/api/v1/image/assets%2F1fa6810c36c54e87bfe1a6cc0f0be906%2F187c548d37a24f68adc65382ac7c553c',
  inputs: [
    {
      name: 'product',
      type: 'BigCommerceProduct',
    },
    {
      name: 'customizer',
      type: 'map'
    }
  ],
};
Builder.registerComponent(ProductBox, ProductBoxBuilderConfig);
