import { Cross, Check } from '@components/icons'
import useCart from '@framework/cart/use-cart'
import usePrice from '@framework/use-price'
import CartPreview from '../CartItem/CartPreview'
import Link from 'next/link'
import DottedArrow from '@components/icons/DottedArrow'
import EmptyProduct from '@components/icons/EmptyProduct'
import { useRouter } from 'next/router'
import useSearch from '@framework/products/use-search'
import { useEffect, useState } from 'react'

const CartSidebarView = ({ currency }: any) => {
  const { data, isEmpty } = useCart()
  const { pathname } = useRouter()
  const [isStockOut, setIsStockOut] = useState([])
  const { price: total } = usePrice(
    data && {
      amount: data.base_amount,
      currencyCode: currency?.currency_code ? currency?.currency_code : 'USD',
      currencyExchange: currency?.currency_exchange_rate
        ? parseFloat(currency?.currency_exchange_rate)
        : 1,
    }
  )

  const items =
    data?.line_items?.physical_items.filter((item: any) => {
      return item?.parent_id === null
    }) ?? []

  const uniqueValueIds = new Set(
    data?.line_items?.physical_items.map((item: any) => item.product_id)
  )
  const commaSeparatedString = Array.from(uniqueValueIds).join(',')
  const product = useSearch({ productIn: commaSeparatedString })
  const error = null
  const success = null
  useEffect(() => {
    if (product?.data?.found) {
      const stockOut: any = []
      product?.data?.products.forEach((prod: any) => {
        if (
          prod?.node?.variants?.edges[0]?.node?.inventory?.isInStock === false
        ) {
          stockOut.push(prod?.node?.name)
        }
      })

      if (stockOut?.length) {
        setIsStockOut(stockOut)
      }
    }
  }, [product])

  return (
    <div>
      {isEmpty ? (
        <div className="cart-popup-empty flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-dashed border-primary rounded-full flex items-center justify-center w-16 h-16">
            <EmptyProduct className="absolute" />
          </span>
          <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
            Your cart is empty
          </h2>
        </div>
      ) : error ? (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
            <Cross width={24} height={24} />
          </span>
          <h2 className="pt-6 text-xl font-light text-center">
            We couldn’t process the purchase. Please check your card information
            and try again.
          </h2>
        </div>
      ) : success ? (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
            <Check />
          </span>
          <h2 className="pt-6 text-xl font-light text-center">
            Thank you for your order.
          </h2>
        </div>
      ) : (
        <>
          <h2 className="card-header flex align-v-center justify-space">
            Cart
            {pathname !== '/cart' && (
              <Link href="/cart">
                <a
                  href="/cart"
                  className="view-cart flex align-center justify-center"
                >
                  <span>View Cart</span> <DottedArrow />
                </a>
              </Link>
            )}
          </h2>
          {!!isStockOut?.length && (
            <div className="alert-box p-2 mb-8">
              <p className="mb-0">
                The Product added is out of stock, could not proceed with
                checkout.
              </p>
            </div>
          )}
          <ul className="m-0">
            {items.map((item: any) => (
              <CartPreview key={item.id} item={item} currency={currency} />
            ))}
          </ul>

          <div className="mt-8">
            <div className="flex align-v-center justify-end">
              <p className="flex flex-direction justify-end mb-0 mr-4">
                <span className="item-label">Subtotal</span>
                <span className="item-price">{total}</span>
              </p>
              <a
                className={`btn  ${isStockOut?.length ? 'disabled' : ''}`}
                href="/checkout"
              >
                Checkout
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CartSidebarView
