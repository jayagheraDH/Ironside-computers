import { Builder } from '@builder.io/react';

import ProductCard from './ProductCard';

export const ProductCardConfig = {
  name: 'Product Card',
  inputs: [
    {
      name: 'ProductCard',
      type: 'reference',
    }
  ],

};
Builder.registerComponent(ProductCard, ProductCardConfig);