import React, { useEffect, useState } from 'react'
import { UserNav } from '@components/common'
import SupportMenu from './SupportMenu'
import { ArrowLeft, Cross } from '@components/icons'
import { useRouter } from 'next/router'

const MobileMenu = ({ data, mobileMenu }: any) => {
  const [clicked, setClicked] = useState('')
  const router = useRouter()
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
  const onMenuSelected = (link: any) => {
    setTimeout(() => {
      document.body.classList.remove('menu-opened')
    }, 800)
    router.push(`/${link}`)
  }

  return (
    <>
      <div className="mobile-menu">
        <UserNav mobileMenu={mobileMenu} device={'mobile'} />
        <div>
          <ul
            className="mobile-navigation list-none flex align-v-center"
            data-lenis-prevent
          >
            {Object.keys(data || {}).map(
              (menu: any, index: any) =>
                menu !== 'support' && (
                  <li key={index} className={menu}>
                    <a
                      className={`category-heading ${
                        clicked === menu ? `is-open` : 'close'
                      }`}
                      onClick={() => {
                        setClicked(menu)
                      }}
                      role="button"
                    >
                      {menu}
                    </a>
                    {menu === 'about' && (
                      <div className="menu-description">
                        <div className="sub-menu-heading">
                          {menu}
                          <span
                            className={`category-heading ${
                              clicked === menu ? `close` : 'is-open'
                            }`}
                            onClick={() => {
                              clicked === menu
                                ? setClicked('')
                                : setClicked(menu)
                            }}
                            role="button"
                          >
                            <ArrowLeft />
                          </span>
                        </div>
                        <div className="mega-menu about-menu">
                          <div className="mega-menu-content-box">
                            <div
                              dangerouslySetInnerHTML={{ __html: data?.about }}
                            />
                            <SupportMenu data={data?.support} />
                          </div>
                        </div>
                      </div>
                    )}
                    {!!data[menu].blackThemeImage && (
                      <div className="menu-description">
                        <div className="sub-menu-heading">
                          <span
                            className={`category-heading ${
                              clicked === menu ? `close` : 'is-open'
                            }`}
                            onClick={() => {
                              clicked === menu
                                ? setClicked('')
                                : setClicked(menu)
                            }}
                            role="button"
                          >
                            <ArrowLeft />
                          </span>
                          {menu}
                          <p
                            className="close mb-0"
                            onClick={() => {
                              mobileMenu()
                              setClicked('')
                            }}
                          >
                            <Cross />
                          </p>
                        </div>
                        {data[menu]?.megaMenu?.map(
                          (items: any, index: number) => (
                            <div className="mega-menu-content-box" key={index}>
                              {theme === 'dark' ? (
                                <div>
                                  {!!items?.blackThemeImage && (
                                    <img
                                      src={items?.blackThemeImage}
                                      alt={items?.title}
                                      onClick={() => onMenuSelected(items?.link)}
                                    />
                                  )}
                                </div>
                              ) : (
                                <div>
                                  {!!items?.whiteThemeImage && (
                                    <img
                                      src={items?.whiteThemeImage}
                                      alt={items?.title}
                                      onClick={() => onMenuSelected(items?.link)}
                                    />
                                  )}
                                </div>
                              )}
                              <h2 className="mega-menu-heading">
                                <div
                                  onClick={() => onMenuSelected(items?.link)}
                                >
                                  {items.title}
                                </div>
                              </h2>
                              <p className="mega-menu-description">
                                {items.description}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </li>
                )
            )}
          </ul>
          <SupportMenu data={data?.support} />
        </div>
      </div>
    </>
  )
}
export default MobileMenu
