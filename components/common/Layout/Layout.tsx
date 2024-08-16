import cn from 'classnames'
import dynamic from 'next/dynamic'
import $ from 'jquery'
import s from './Layout.module.css'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { useUI } from '@components/ui/context'
import { useAcceptCookies } from '@lib/hooks/useAcceptCookies'
import { Sidebar, Modal, LoadingDots } from '@components/ui'
import { CartSidebarView } from '@components/cart'

import LoginView from '@components/auth/LoginView'
import { CommerceProvider } from '@framework'
import type { Page } from '@framework/api/operations/get-all-pages'
import FeatureBar from '../FeatureBar/FeatureBar'

const Loading = () => (
  <div className="w-80 h-80 flex items-center text-center justify-center p-3">
    <LoadingDots />
  </div>
)

const ForgotPassword = dynamic(
  () => import('@components/auth/ForgotPassword'),
  {
    loading: () => <Loading />,
  }
)

interface Props {
  pageProps: {
    pages?: Page[]
  }
}

const Layout: FC<Props> = ({ children, pageProps }) => {
  const { displaySidebar, displayModal, closeSidebar, closeModal, modalView } =
    useUI()
  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()
  const [currency, setCurrency] = useState({})
  const { locale = 'en-US' } = useRouter()
  useEffect(() => {
    const currencyData: any = localStorage.getItem('currency_data')
    setCurrency(JSON.parse(currencyData))
    $(document).on('CURRENCY_UPDATE', () => {
      const currencyData: any = localStorage.getItem('currency_data')
      setCurrency(JSON.parse(currencyData))
    })
  }, [])

  return (
    <CommerceProvider locale={locale}>
      <div className={cn(s.root)}>
        <main className="fit">{children}</main>

        <Modal open={displayModal} onClose={closeModal}>
          {modalView === 'LOGIN_VIEW' && <LoginView />}
          {modalView === 'FORGOT_VIEW' && <ForgotPassword />}
        </Modal>

        <Sidebar open={displaySidebar} onClose={closeSidebar}>
          <CartSidebarView currency={currency} />
        </Sidebar>

        <FeatureBar
          className="cookies-banner"
          title="This site uses cookies to improve your experience. By clicking, you agree to our Privacy Policy."
          hide={acceptedCookies}
          action={
            <div className="cookie-bottom">
              <button className="btn" onClick={() => onAcceptCookies()}>
                Accept cookies
              </button>
            </div>
          }
        />
      </div>
    </CommerceProvider>
  )
}

export default Layout
