import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { UserNav } from '@components/common'
import MegaMenu from './MegaMenu'
import AboutMenu from './AboutMenu'
import Hamburgers from '@components/icons/Hamburgers'
import MobileMenu from './MobileMenu'
import { Portal } from '@reach/portal'
import { Cross } from '@components/icons'

const Header = (props: any) => {
  const data = props?.headerData
    ? props?.headerData
    : props?.header?.value?.data
  const [menuOpen, setMenuOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [theme, setTheme] = useState('black')
  let themeAttr = 'dark'
  if (typeof window !== 'undefined') {
    const bodyTheme: any = document
      .querySelector('body')
      ?.getAttribute('data-theme')
    themeAttr = bodyTheme
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bodyTheme: any = document
        .querySelector('body')
        ?.getAttribute('data-theme')
      setTheme(bodyTheme)
    }
  }, [themeAttr])

  const mobileMenu = useCallback(() => {
    setMenuOpen(!menuOpen)
    document.querySelector('body')?.classList.toggle('menu-opened')
  }, [menuOpen])

  return (
    <div className="header">
      {!!props?.sale_banner_text && (
        <div
          className="sale-banner mobile"
          onClick={() => {
            setShowModal(true)
          }}
        >
          <p>{props?.sale_banner_text}</p>
        </div>
      )}
      <div className="relative flex">
        <div className="header-inner relative d-flex flex-row justify-space pt-40 align-v-center">
          <div className="header-left d-flex items-center">
            <Link href="/">
              <a className="logo" aria-label="Logo">
                {theme === 'light' ? (
                  <img
                    src={data?.logo?.whiteThemeLogo}
                    alt="logo"
                    width="82px"
                    height="47px"
                  />
                ) : (
                  <img
                    src={data?.logo?.blackThemeLogo}
                    alt="logo"
                    width="82px"
                    height="47px"
                  />
                )}
              </a>
            </Link>
            <div className="mobile-menu-btn" onClick={() => mobileMenu()}>
              <Hamburgers />
            </div>

            <nav className="hidden ml-6 space-x-4 lg:block">
              <ul className="list-none flex align-v-center">
                {Object.keys(data?.categories || {}).map(
                  (key: any, index: any) => {
                    return (
                      key !== 'support' && (
                        <li key={index} className={key}>
                          <a
                            href={key === 'laptops' ? '/laptops' : '/'}
                            className="category-heading"
                            role="button"
                          >
                            {key}
                          </a>
                          {key === 'about' && (
                            <AboutMenu data={data?.categories} />
                          )}
                          {!!data?.categories[key].blackThemeImage && (
                            <MegaMenu data={data?.categories[key]} />
                          )}
                        </li>
                      )
                    )
                  }
                )}
              </ul>
            </nav>
          </div>

          <div className="header-right d-flex justify-end">
            {!!props?.sale_banner_text && (
              <div className="sale-banner" onClick={() => setShowModal(true)}>
                <p>{props?.sale_banner_text}</p>
              </div>
            )}

            <UserNav mobileMenu={mobileMenu} />
          </div>
        </div>
      </div>
      <MobileMenu data={data?.categories} mobileMenu={mobileMenu} />
      <Portal>
        <div>
          <div role="dialog" className="sale-dialog">
            {showModal ? (
              <>
                <div className="modal sale-modal flex flex-wrap justify-space items-start">
                  <img src={data?.saleBannerImage} alt={'sale-banner'} />
                  <button
                    onClick={() => setShowModal(false)}
                    aria-label="Close panel"
                    className="modal-close"
                  >
                    <Cross className="h-6 w-6" />
                  </button>
                </div>
                <span onClick={() => setShowModal(false)} />
              </>
            ) : null}
          </div>
        </div>
      </Portal>
    </div>
  )
}

export default Header
