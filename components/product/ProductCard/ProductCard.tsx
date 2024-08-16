import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import type { FC } from 'react'
import s from './ProductCard.module.css'
import WishlistButton from '@components/wishlist/WishlistButton'

import usePrice from '@framework/use-price'
import type { ProductNode } from '@framework/api/operations/get-all-products'

interface Props {
  className?: string
  product: ProductNode
  variant?: 'slim' | 'simple'
  imgWidth: number | string
  imgHeight: number | string
  imgLayout?: 'fixed' | 'intrinsic' | 'responsive' | undefined
  imgPriority?: boolean
  imgLoading?: 'eager' | 'lazy'
  imgSizes?: string
}

const ProductCard: FC<Props> = ({
  className,
  product: p,
  variant,
  imgWidth,
  imgHeight,
  imgPriority,
  imgLoading,
  imgSizes,
  imgLayout = 'responsive',
}) => {
  const placeholderImg = '/product-img-placeholder.svg';
  const { price } = usePrice({
    // @ts-ignore next-line
    amount: Number(p?.price || p.prices?.price?.value),
    // @ts-ignore next-line
    baseAmount: Number(p?.price || p.prices?.retailPrice?.value),
    currencyCode: p.prices?.price?.currencyCode! || 'USD',
  })

  // @ts-ignore next-line
  const productImageSrc = p?.images[0]?.url_standard
  const src = p.images.edges?.[0]?.node?.urlOriginal! || productImageSrc

  return (
    // @ts-ignore next-line
    <Link href={`/product${p.custom_url?.url || p.path }`}>
      <a
        className={cn(s.root, { [s.simple]: variant === 'simple' }, className)}
      >
        {variant === 'slim' ? (
          <div className="relative overflow-hidden box-border">
            <div className="absolute inset-0 flex items-center justify-end mr-8 z-20">
              <span className="bg-black text-white inline-block p-3 font-bold text-xl break-words">
                {p.name}
              </span>
            </div>
            <Image
              quality="85"
              width={imgWidth}
              sizes={imgSizes}
              height={imgHeight}
              layout={imgLayout}
              loading={imgLoading}
              priority={imgPriority}
              src={p?.images?.edges?.[0]?.node.urlOriginal! || productImageSrc || placeholderImg}
              alt={p?.images?.edges?.[0]?.node.altText || 'Product Image'}
            />
          </div>
        ) : (
          <>
            <div className={s.squareBg} />
            <div className="flex flex-row justify-between box-border w-full z-20 absolute">
              <div className="absolute top-0 left-0 pr-16 max-w-full">
                <h3 className={s.productTitle}>
                  <span>{p.name}</span>
                </h3>
                <span className={s.productPrice}>{price}</span>
              </div>
              <WishlistButton
                className={s.wishlistButton}
                productId={p.entityId}
                variant={p.variants?.edges?.[0]!}
              />
            </div>
            <div className={s.imageContainer}>
              <Image
                src={src}
                alt={p.name}
                width={imgWidth}
                sizes={imgSizes}
                height={imgHeight}
              />
            </div>
          </>
        )}
      </a>
    </Link>
  )
}

export default ProductCard
