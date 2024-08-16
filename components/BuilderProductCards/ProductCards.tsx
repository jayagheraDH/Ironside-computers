import { useEffect, useState } from 'react'
import axios from 'axios'
import { ProductView } from '@components/product'
import { ProductNode } from '@framework/api/operations/get-product'

interface AppProps {
  product: {
    options: {
      product: string
    }
  }
}

const ProductCards = (props: any) => {
  const [product, setProduct] = useState<ProductNode>()  
  
  useEffect(() => {
    if (props?.product?.options?.product) {
      const fetchProduct = async () => {
        const result = await axios.get(`/api/bigcommerce/product/${props?.product?.options?.product}`)
        setProduct(result.data?.data)
      }
      fetchProduct()
      
    }
  }, [props?.product?.options?.product])
  
  if (!product) return null  

  return (
    <div>
      <ProductView product={product} />
    </div>
  );
}

export default ProductCards;