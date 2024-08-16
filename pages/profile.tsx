import $ from 'jquery'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { setCookie } from 'cookies-next'
import { useEffect, useState } from 'react'
import builder, { BuilderComponent } from '@builder.io/react'
import { getConfig } from '@framework/api'
import useLogout from '@framework/use-logout'
import useCart from '@framework/cart/use-cart'
import useCustomer from '@framework/use-customer'
import getAllPages from '@framework/api/operations/get-all-pages'
import useSetCustomerAttribute from '@framework/use-set-customer-attribute'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import Header from '@components/BuilderHeader/Header'
import AccountDetails from '@components/myProfle/accountDetails'
import Addresses from '@components/myProfle/Addresses/addresses'
import OrderHistory from '@components/myProfle/orderHistory'

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

export default function Profile({
  header,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [profileTab, setProfileTab] = useState('accountDetails')
  const [updateAddressOpen, setUpdateAddressOpen] = useState(false)
  const [currency, setCurrency] = useState<any>({})
  const { data }: any = useCustomer()
  const logout = useLogout()
  const router = useRouter()
  const [isSelected, setIsSelected] = useState(false)
  const { data: cartData } = useCart()
  const setCustomerAttribute = useSetCustomerAttribute()

  if (typeof window !== 'undefined') {
    document.querySelector('#body')?.setAttribute('data-theme', 'dark')
    document.querySelector('html')?.removeAttribute('data-theme')
  }

  const setCartId = async () => {
    if (cartData?.id) {
      await setCustomerAttribute({
        attribute_id: 1,
        value: cartData?.id,
        customer_id: data?.entityId,
      })
      setCookie('bc_cartId', cartData?.id)
    }
    router.push('/profile')
  }

  useEffect(() => {
    const currencyData: any = localStorage.getItem('currency_data')
    if (currencyData) setCurrency(JSON.parse(currencyData))
    $(document).on('CURRENCY_UPDATE', () => {
      const currencyData: any = localStorage.getItem('currency_data')
      setCurrency(JSON.parse(currencyData))
    })
    if (data === null) router.push('/')
    else {
      setCartId()
    }
  }, [data])

  return (
    <>
      <div className="account-page">
        <Header headerData={header?.data} />
        <Container>
          <div className="account-pages maxw-260" data-lenis-prevent>
            <div className="account-pages-heading d-flex align-v-center justify-space">
              <Text variant="pageHeading">My Account</Text>
              <button
                className="btn-small"
                onClick={() => {
                  logout()
                  router.push('/')
                }}
              >
                Logout
              </button>
            </div>
            <div className="addresses-box">
              <div className="account-tabbing">
                <ul className="list-none">
                  <li
                    className={
                      profileTab === 'orderHistory' ? 'is-selected' : ''
                    }
                    onClick={() => {
                      setIsSelected(!isSelected)
                      if (profileTab === 'orderHistory')
                        setUpdateAddressOpen(false)
                      setProfileTab('orderHistory')
                    }}
                  >
                    Order History
                  </li>
                  <li
                    className={
                      profileTab == 'accountDetails' ? 'is-selected' : ''
                    }
                    onClick={() => {
                      setProfileTab('accountDetails')
                      setIsSelected(!isSelected)
                    }}
                  >
                    Account Details
                  </li>
                  <li
                    className={profileTab === 'addresses' ? 'is-selected' : ''}
                    onClick={() => {
                      setIsSelected(!isSelected)
                      if (profileTab === 'addresses')
                        setUpdateAddressOpen(false)
                      setProfileTab('addresses')
                    }}
                  >
                    Addresses
                  </li>
                  <li
                    className={profileTab === 'affiliate' ? 'is-selected' : ''}
                    onClick={() => setIsSelected(!isSelected)}
                  >
                    Affiliate Portal
                  </li>
                </ul>
              </div>
              {profileTab === 'accountDetails' && <AccountDetails />}
              {profileTab === 'orderHistory' && <OrderHistory data={data} currency={currency} />}
              {profileTab === 'addresses' && (
                <Addresses
                  updateAddressOpen={updateAddressOpen}
                  setUpdateAddressOpen={setUpdateAddressOpen}
                  data={data}
                />
              )}
            </div>
          </div>
          <div className="mt50">
            <BuilderComponent model="symbol" />
          </div>
        </Container>
      </div>
    </>
  )
}

Profile.Layout = Layout
