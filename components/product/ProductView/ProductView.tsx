import { FC, useState } from 'react'
import cn from 'classnames'
import Image from 'next/image'
import { NextSeo } from 'next-seo'

import s from './ProductView.module.css'
import { useUI } from '@components/ui/context'
import { Swatch, ProductSlider } from '@components/product'
import { Button, Container, Text } from '@components/ui'

import usePrice from '@framework/use-price'
import useAddItem from '@framework/cart/use-add-item'
import type { ProductNode } from '@framework/api/operations/get-product'
import {
  getCurrentVariant,
  getProductOptions,
  SelectedOptions,
} from '../helpers'
import WishlistButton from '@components/wishlist/WishlistButton'
import { useRouter } from 'next/router'
interface Props {
  className?: string
  children?: any
  product: ProductNode
}

const ProductView: FC<Props> = (props) => {
  const { product } = props
  const addItem = useAddItem()
  const { price } = usePrice({
    // @ts-ignore next-line
    amount: Number(product?.price || product.prices?.price?.value),
    // @ts-ignore next-line
    baseAmount: Number(product?.price || product.prices?.retailPrice?.value),
    currencyCode: product.prices?.price?.currencyCode! || 'USD',
  })
  const { openSidebar } = useUI()
  const options = getProductOptions(product)
  const [loading, setLoading] = useState(false)
  const [choices, setChoices] = useState<SelectedOptions>({
    size: null,
    color: null,
  })
  const router = useRouter()
  // @ts-ignore next-line
  const variant = getCurrentVariant(product, choices) || product?.variants[0]

  const addToCart = async () => {
    setLoading(true)
    {/* @ts-ignore next-line*/}
    const productId = product.entityId || product.id
    const variantId= variant?.id || variant?.node.entityId!

    try {
      await addItem({
        // @ts-ignore next-line
        productId,
        variantId,
      })
      if (window?.innerWidth <= 1023) {
        router.push('/cart')
      } else {
        openSidebar()
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }
  // @ts-ignore next-line
  const legacyImages = product && product.images.length? product.images.map((item) => ({ node: { urlOriginal: item.url_standard, altText: product?.name }  })) : null

  return (
    <Container className="max-w-none w-full" clean>
      <NextSeo
        title={product.name}
        description={product.description}
        openGraph={{
          type: 'website',
          title: product.name,
          description: product.description,
          images: [
            {
              url: product?.images?.edges?.[0]?.node.urlOriginal!,
              width: 800,
              height: 600,
              alt: product.name,
            },
          ],
        }}
      />
      <div className={cn(s.root, 'fit')}>
        <div className={cn(s.productDisplay, 'fit')}>
          <div className={s.nameBox}>
            <h1 className={s.name}>{ product.name }</h1>
            <div className={s.price}>
              {price}
              {` `}
              {product.prices?.price.currencyCode}
            </div>
          </div>

          <div className={s.sliderContainer}>
            {/* @ts-ignore next-line*/}
            <ProductSlider key={product.entityId || product.custom_url?.url}>
              {/* @ts-ignore next-line*/}
              {(product.images?.edges || legacyImages).map((image, i) => (
                <div key={image?.node.urlOriginal} className={s.imageContainer}>
                  <Image
                    className={s.img}
                    src={image?.node.urlOriginal!}
                    alt={image?.node.altText || 'Product Image'}
                    width={1050}
                    height={1050}
                    priority={i === 0}
                    quality="85"
                  />
                </div>
              ))}
            </ProductSlider>
          </div>
        </div>

        <div className={s.sidebar}>
          <section>
            {options?.map((opt: any) => (
              <div className="pb-4" key={opt.displayName}>
                <h2 className="uppercase font-medium">{opt.displayName}</h2>
                <div className="flex flex-row py-4">
                  {opt.values.map((v: any, i: number) => {
                    const active = (choices as any)[opt.displayName]

                    return (
                      <Swatch
                        key={`${v.entityId}-${i}`}
                        active={v.label === active}
                        variant={opt.displayName}
                        color={v.hexColors ? v.hexColors[0] : ''}
                        label={v.label}
                        onClick={() => {
                          setChoices((choices) => {
                            return {
                              ...choices,
                              [opt.displayName]: v.label,
                            }
                          })
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="pb-14 break-words w-full max-w-xl">
              <Text html={product.description} />
            </div>
          </section>
          <div>
            <Button
              aria-label="Add to Cart"
              type="button"
              className={s.button}
              onClick={addToCart}
              loading={loading}
              disabled={!variant}
            >
              Add to Cart
            </Button>
          </div>
        </div>

        <WishlistButton
          className={s.wishlistButton}
          // @ts-ignore next-line
          productId={product.entityId || product.id}
          variant={variant!}
        />
      </div>
    </Container>
  )
}

export default ProductView
