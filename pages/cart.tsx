import $ from 'jquery'
import { useEffect, useState } from 'react'
import type { GetStaticPropsContext } from 'next'
import builder, { BuilderComponent } from '@builder.io/react'
import { getConfig } from '@framework/api'
import usePrice from '@framework/use-price'
import useCart from '@framework/cart/use-cart'
import getAllPages from '@framework/api/operations/get-all-pages'
import { Layout } from '@components/common'
import { CartItem } from '@components/cart'
import { useUI } from '@components/ui/context'
import Header from '@components/BuilderHeader/Header'
import EmptyProduct from '@components/icons/EmptyProduct'
import { Cross, Check, Moon, Sun } from '@components/icons'
import useSearch from '@framework/products/use-search'

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  const config = getConfig({ locale })
  const { pages } = await getAllPages({ config, preview })
  const header = await builder.get('header').toPromise()
  return {
    props: { pages, header },
  }
}

export default function Cart({ header }: any) {
  const [themeColor, setThemeColor] = useState(false)
  const [currency, setCurrency] = useState<any>({})
  const [isStockOut, setIsStockOut] = useState([])

  const { data, isEmpty }: any = useCart()
  const { closeSidebar } = useUI()
  const { price: subTotal } = usePrice(
    data && {
      amount: data.base_amount,
      currencyCode: currency?.currency_code ? currency?.currency_code : 'USD',
      currencyExchange: currency?.currency_exchange_rate
        ? parseFloat(currency?.currency_exchange_rate)
        : 1,
    }
  )
  const { price: total } = usePrice(
    data && {
      amount: data.cart_amount,
      currencyCode: currency?.currency_code ? currency?.currency_code : 'USD',
      currencyExchange: currency?.currency_exchange_rate
        ? parseFloat(currency?.currency_exchange_rate)
        : 1,
    }
  )
  const uniqueValueIds = new Set(
    data?.line_items?.physical_items.map((item: any) => item.product_id)
  )
  const commaSeparatedString = Array.from(uniqueValueIds).join(',')
  const product = useSearch({ productIn: commaSeparatedString })
  let discountedPrice = 0
  const error = null
  const success = null

  data?.discounts.forEach((item: any) => {
    const price = discountedPrice + item.discounted_amount
    discountedPrice = price
  })

  const items =
    data?.line_items?.physical_items.filter((item: any) => {
      return item?.parent_id === null
    }) ?? []

  const checkThemeColor = (dark: boolean) => {
    if (dark == true) {
      document.querySelector('#body')?.setAttribute('data-theme', 'light')
      setThemeColor(true)
    } else {
      setThemeColor(false)
      document.querySelector('#body')?.setAttribute('data-theme', 'dark')
    }
  }
  const totalQuantities = items
    .map((item: any) => item.quantity)
    .reduce((acc: number, curr: number) => acc + curr, 0)

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.querySelector('#body')?.setAttribute('data-theme', 'dark')
      document.querySelector('html')?.removeAttribute('data-theme')
    }
    closeSidebar()
    const currencyData: any = localStorage.getItem('currency_data')
    if (currencyData) setCurrency(JSON.parse(currencyData))
    $(document).on('CURRENCY_UPDATE', () => {
      const currencyData: any = localStorage.getItem('currency_data')
      setCurrency(JSON.parse(currencyData))
    })
  }, [])
  if (typeof window !== 'undefined') {
    document.querySelector('html')?.removeAttribute('data-theme')
  }

  return (
    <div className="account-page">
      <Header headerData={header?.data} />
      <div
        className="cart-account-page account-pages maxw-260"
        data-lenis-prevent
      >
        <div className="account-pages-heading d-flex align-v-center justify-space themeColor">
          <h1 className="Text_pageHeading__VhZNf">Cart</h1>
          <p
            className="flex align-center justify-center mb-0 cursor-pointer"
            onClick={() => checkThemeColor(themeColor ? false : true)}
          >
            {themeColor == false ? <Moon /> : <Sun />}
          </p>
        </div>
        <div className="cart-page">
          <div className="cart-page-left lg:col-span-8">
            {isEmpty ? (
              <div className="cart-popup-empty flex-1 px-12 py-24 flex flex-col justify-center items-center ">
                <span className="border border-dashed border-secondary flex items-center justify-center w-16 h-16 bg-primary rounded-lg text-primary">
                  <EmptyProduct />
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
                  We couldn’t process the purchase. Please check your card
                  information and try again.
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
              <div>
                <ul className="cart-listing m-0">
                  {items.map((item: any, index: number) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      itemIndex={index}
                      currency={currency}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="cart-page-right lg:col-span-4">
            <div>
              <div className="sub-total">
                <ul className="sub-total-top ml-0">
                  <li className="flex justify-between">
                    <span className="cart-subtotal-label">Total Items</span>
                    <span className="cart-subtotal-value">
                      {totalQuantities}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="cart-subtotal-label">Subtotal</span>
                    <span className="cart-subtotal-value">{subTotal}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="cart-subtotal-label">Promotions</span>
                    <span className="cart-subtotal-value">
                      -${discountedPrice}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="cart-subtotal-label">Shipping</span>
                    <span className="cart-subtotal-value">
                      Calculated at checkout
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="cart-subtotal-label">Taxes</span>
                    <span className="cart-subtotal-value">$0.00</span>
                  </li>
                </ul>
                <div className="sub-total-bottom flex justify-between">
                  <span className="cart-total-label">Total</span>
                  <span className="cart-total-value">{total}</span>
                </div>
              </div>
              {!!isStockOut?.length && (
                <div className="alert-box p-5 mt-10">
                  <p className="mb-0">{`The inventory level for the following product is below what you ordered, so we could not proceed with the checkout:${isStockOut.join(
                    ','
                  )}`}</p>
                </div>
              )}
              <div className="checkout-btn mt-16 w-full block">
                {isEmpty ? (
                  <a className="btn" href="/">
                    Continue Shopping
                  </a>
                ) : (
                  <a
                    className={`block btn w-100 ${
                      isStockOut?.length ? 'disabled' : ''
                    }`}
                    href="/checkout"
                  >
                    Checkout
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt50">
        <BuilderComponent model="symbol" />
      </div>
    </div>
  )
}

Cart.Layout = Layout
