import { FC, useState } from 'react'
import usePrice from '@framework/use-price'
import ProductInfoModal from '../ProductInfoModal/ProductInfoModal'
import { useUI } from '@components/ui/context'
import useAddItem from '@framework/cart/use-add-item'
import { Portal } from '@reach/portal'
import { ToastContainer, toast, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useCustomer from '@framework/use-customer'
import { Button } from '@components/ui'
import { useRouter } from 'next/router'

interface Props {
  className?: string
  imgWidth: number | string
  imgHeight: number | string
  imgLayout?: 'fixed' | 'intrinsic' | 'responsive' | undefined
  imgPriority?: boolean
  imgLoading?: 'eager' | 'lazy'
  imgSizes?: string
  productsData: any
  currency?: any
}

const MerchGearProductCard: FC<Props> = ({
  imgWidth,
  imgHeight,
  imgSizes,
  productsData,
  currency,
}) => {
  const [showSizes, setShowSizes] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showAddToCartBtn, setShowAddToCartBtn] = useState(true)
  const addItem = useAddItem()
  const router = useRouter()
  const { data: customer }: any = useCustomer()

  const productImages: any = []
  const { displayModal, closeModal, openSidebar } = useUI()
  const { price } = usePrice({
    // @ts-ignore next-line
    amount: Number(
      productsData?.price ||
        productsData?.prices?.price?.value ||
        productsData?.prices?.salePrice?.value
    ),
    // @ts-ignore next-line
    baseAmount: Number(
      productsData?.price ||
        productsData?.prices?.retailPrice?.value ||
        productsData?.prices?.salePrice?.value
    ),
    currencyCode: currency?.currency_code ? currency?.currency_code : 'USD',
    currencyExchange: currency?.currency_exchange_rate
      ? parseFloat(currency?.currency_exchange_rate)
      : 1,
  })

  // @ts-ignore next-line
  productsData?.images?.edges?.forEach((element) => {
    productImages.push(element?.node?.urlOriginal)
  })
  // @ts-ignore next-line
  const productImageSrc = productsData?.images[0]?.url_standard

  const src =
    productsData?.images.edges?.[0]?.node?.urlOriginal! || productImageSrc
  const notifyError = () => {
    toast.error('Out of stock!')
  }

  const addItemToCart = async (size: any) => {
    setShowSizes(false)
    setLoading(true)
    setShowAddToCartBtn(true)
    if (!size.productId) return
    try {
      await addItem({
        productId: size.productId,
        variantId: size.variantId,
        customerId: customer && customer?.entityId,
      })
        .then(() => {
          setLoading(false)
          if (window?.innerWidth <= 1023) {
            router.push('/cart')
          } else {
            openSidebar()
          }
        })
        .catch((err) => {
          console.error(err?.errors[0]?.message)
          notifyError()
          setLoading(false)
          return
        })
    } catch (error: any) {
      console.error(error?.errors)
      setLoading(false)
      return
    }
  }

  const isOutOfStock = productsData?.sizes?.every(
    (item: { isInStock: boolean }) => item?.isInStock === false
  )

  return (
    <>
      {!!productImages?.length && (
        <div className="flex flex-direction">
          <div className="card-figure flex align-v-center justify-center">
            <ProductInfoModal
              open={displayModal}
              onClose={closeModal}
              heading={<>{productsData.name}</>}
              text={productsData.description}
              button={<>...</>}
              productImages={productImages}
            />
            <img
              src={src}
              alt={productsData?.name}
              width={imgWidth}
              sizes={imgSizes}
              height={imgHeight}
            />
          </div>
          <div className="card-body flex align-v-center justify-space">
            <div>
              <p>{productsData.name}</p>
              <span>{price}</span>
            </div>
            <div className="flex align-v-center justify-space-end">
              {productsData?.sizes ? (
                <>
                  {showAddToCartBtn && (
                    <Button
                      className={`btn ${showSizes}`}
                      loading={loading}
                      onClick={() => {
                        setShowAddToCartBtn(false)
                        setShowSizes(true)
                      }}
                    >
                      ADD TO CART
                    </Button>
                  )}
                </>
              ) : productsData.isInStock ? (
                <Button
                  className="btn"
                  loading={loading}
                  onClick={() => {
                    addItemToCart({
                      productId: productsData?.productId,
                      variantId: productsData?.variantId,
                    })
                  }}
                >
                  ADD TO CART
                </Button>
              ) : (
                <button className="btn disabled stock">Out Of Stock</button>
              )}
              <div // show sizes modal
                className={`sizes ${
                  productsData?.sizes && !isOutOfStock
                    ? 'border border-radius'
                    : 'p-0'
                }`}
              >
                {!!showSizes && isOutOfStock ? (
                  <button className="btn disabled stock">Out Of Stock</button>
                ) : (
                  !!showSizes &&
                  productsData?.sizes?.map((ele: any, index: number) => {
                    return (
                      ele?.isInStock && (
                        <span key={index} onClick={() => addItemToCart(ele)}>
                          {ele.size}
                        </span>
                      )
                    )
                  })
                )}
              </div>
            </div>
          </div>
          <Portal>
            <ToastContainer
              transition={Flip}
              position="bottom-center"
              autoClose={5000}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover={false}
              theme="dark"
            />
          </Portal>
        </div>
      )}
    </>
  )
}

export default MerchGearProductCard
