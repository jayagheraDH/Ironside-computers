import builder from '@builder.io/react'
import AboutMenu from '@components/BuilderHeader/AboutMenu'
import MegaMenu from '@components/BuilderHeader/MegaMenu'
import MobileMenu from '@components/BuilderHeader/MobileMenu'
import Hamburgers from '@components/icons/Hamburgers'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

const CategoryHeader = (props: any) => {
  const data = props?.categoryHeaderData
    ? props?.categoryHeaderData
    : props?.header?.value?.data
  const [theme, setTheme] = useState('black')
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerData, setHeaderData] = useState<any>({})
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false)
  const headerRef = useRef<any>(null)
  const [stickyApplied, setStickyApplied] = useState(false)

  useEffect(() => {
    const galleryButton: any = document.querySelector('#galleryButton')
    const techSpecsButton: any = document.getElementById('techSpecButton')
    const overviewButton: any = document.getElementById('overviewButton')
    const buyNowButton: any = document.getElementById('buyNowButton')
    const HeaderHeight: any = document.querySelector('.category-header')
    const gallery: any = document.getElementById('photo-gallery')
    const techSpecs: any = document.getElementById('tech-spec')
    const overview: any = document.getElementById('overview')

    if (typeof window !== 'undefined') {
      const bodyTheme: any = document
        .querySelector('body')
        ?.getAttribute('data-theme')
      setTheme(bodyTheme)
    }

    //galleryButton
    galleryButton?.addEventListener('click', function () {
      const scrollPosition = gallery?.offsetTop - HeaderHeight?.clientHeight
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      })
    })

    //techSpecsButton Button
    techSpecsButton?.addEventListener('click', function () {
      const scrollPosition = techSpecs?.offsetTop - HeaderHeight?.clientHeight
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      })
    })

    overviewButton?.addEventListener('click', function () {
      const scrollPosition =
        overview?.offsetTop - HeaderHeight?.clientHeight - 50
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      })
    })

    buyNowButton?.addEventListener('click', function () {
      const scrollPosition =
        overview?.offsetTop - HeaderHeight?.clientHeight - 50
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      })
    })
    fetchHeaderData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.clientHeight
        const scrollPosition = window.scrollY

        // Check if the scroll position is greater than the header height
        const scrolledPastHeader = scrollPosition > headerHeight

        setIsHeaderScrolled(scrolledPastHeader)

        // Apply sticky class only once when header scrolled past
        if (scrolledPastHeader && !stickyApplied) {
          document?.querySelector('.category-header')?.classList.add('sticky')
          setStickyApplied(true)
        } else if (!scrolledPastHeader && stickyApplied) {
          // Remove sticky class when scrolled back above header
          document
            ?.querySelector('.category-header')
            ?.classList.remove('sticky')
          setStickyApplied(false)
        }
      }
    }

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll)

    // Cleanup: remove the scroll event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, []) // Empty dependency array to ensure the effect runs only once

  const mobileMenu = useCallback(() => {
    setMenuOpen(!menuOpen)
    document.querySelector('body')?.classList.toggle('menu-opened')
  }, [menuOpen])

  const fetchHeaderData = async () => {
    const header = await builder.get('header').toPromise()
    setHeaderData(header)
  }
  return (
    <div className="category-header">
      <div className="category-inner flex items-center justify-between">
        <div className="logo flex justify-start">
          <Link href="/">
            <a className="logo" aria-label="Logo">
              {theme !== 'dark' ? (
                <img
                  src={data?.whiteThemeLogo}
                  alt="logo"
                  width="82px"
                  height="47px"
                />
              ) : (
                <img
                  src={data?.blackThemeLogo}
                  alt="logo"
                  width="82px"
                  height="47px"
                />
              )}
            </a>
          </Link>
        </div>
        <div className="header-left">
          <div className="mobile-menu-btn" onClick={() => mobileMenu()}>
            <Hamburgers />
          </div>

          <nav className="hidden ml-6 space-x-4 lg:block">
            <ul className="list-none flex align-v-center">
              {Object.keys(headerData?.data?.categories || {}).map(
                (key: any, index: any) => {
                  return (
                    key !== 'support' && (
                      <li key={index} className={key}>
                        <a className="category-heading" role="button">
                          {key}
                        </a>
                        {key === 'about' && (
                          <AboutMenu data={headerData?.data?.categories} />
                        )}
                        {!!headerData?.data?.categories[key]
                          ?.blackThemeImage && (
                          <MegaMenu data={headerData?.data?.categories[key]} />
                        )}
                      </li>
                    )
                  )
                }
              )}
            </ul>
          </nav>
          <MobileMenu
            data={headerData?.data?.categories}
            mobileMenu={mobileMenu}
          />
        </div>
        <div
          className="cat-head flex align-v-center justify-space"
          ref={headerRef}
        >
          <div className="text-center">
            {!!props?.page_title && <h1>{props?.page_title}</h1>}
          </div>
          <div className="flex justify-end">
            <ul className="category-header-right list-none flex items-center">
              <li>
                <a className="no-underline" id="overviewButton">
                  Overview
                </a>
              </li>
              <li>
                <a className="no-underline" id="galleryButton">
                  Gallery
                </a>
              </li>
              <li>
                <a className="no-underline" id="techSpecButton">
                  Tech Specs
                </a>
              </li>
              <li className="buy-now">
                <a className="no-underline" id="buyNowButton">
                  Buy Now
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {isHeaderScrolled ? (
        <style>{`
        .category-header {
          position: sticky; top: 0;
        }
        .category-inner .logo {
          display: block !important;
        }
        body .category-header .header-left {
          display: flex !important;
        }
      `}</style>
      ) : (
        ''
      )}
    </div>
  )
}
export default CategoryHeader
