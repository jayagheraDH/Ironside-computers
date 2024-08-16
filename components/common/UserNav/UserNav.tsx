import $ from 'jquery'
import { FC, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import cn from 'classnames'
import useCustomer from '@framework/use-customer'
import { Account, Bag, Cross, Volume } from '@components/icons'
import { useUI } from '@components/ui/context'
import s from './UserNav.module.css'
import { useRouter } from 'next/router'
import useCurrencyConverter from '@framework/use-currency-converter'
import useCart from '@framework/cart/use-cart'
import ClickOutside from '@lib/click-outside/click-outside'
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock'

interface Props {
  className?: string
  mobileMenu?: any
  device?: string
}

const UserNav: FC<Props> = ({ className, mobileMenu, device }) => {
  const { data: customer } = useCustomer()
  const currency = useCurrencyConverter()
  const { pathname, asPath } = useRouter()
  const [isMute, setIsMute] = useState(true)
  const [currencies, setCurrencies] = useState([])
  const [display, setDisplay] = useState(false)
  const [clickEvent, setClickEvent] = useState<string>('')
  const [selectedCurrency, setSelectedCurrency] = useState({
    currency_code: 'USD',
  })
  const [videoButtonShow, setVideoButtonShow] = useState(false)
  const ref = useRef() as React.MutableRefObject<HTMLUListElement>

  const { toggleSidebar } = useUI()

  const getCurrencies = async () => {
    const values = await currency()
    setCurrencies(values)
  }

  const handelCurruncyChange = (val: any) => {
    setSelectedCurrency(val)
    setDisplay(false)
    localStorage.setItem('currency_data', JSON.stringify(val)) // set currency change event
    $(document).trigger('CURRENCY_UPDATE')
  }

  const muteVideos = () => {
    if (typeof window !== 'undefined') {
      const checkLength = document.querySelectorAll('video').length == 0

      if (checkLength == true) {
        if (localStorage.getItem('videoMuted') == 'false') {
          setIsMute(false)
          localStorage.setItem('videoMuted', 'false')
        } else {
          setIsMute(true)
          localStorage.setItem('videoMuted', 'true')
        }
      } else {
        const videos = document.querySelectorAll('video')
        for (const video of videos) {
          if (video.muted) {
            video.muted = false // Unmute
            localStorage.setItem('videoMuted', 'false')
            setIsMute(false)
          } else {
            video.muted = true // Mute
            localStorage.setItem('videoMuted', 'true')
            setIsMute(true)
          }
        }
      }
    }
  }
  const { data } = useCart()
  const items =
    data?.line_items?.physical_items.filter((item: any) => {
      return item?.parent_id === null
    }) ?? []
  const itemsCount = items
    .map((item: any) => item.quantity)
    .reduce((acc: number, curr: number) => acc + curr, 0)

  useEffect(() => {
    if (ref.current) {
      if (display) {
        disableBodyScroll(ref.current)
      } else {
        enableBodyScroll(ref.current)
      }
    }
    return () => {
      clearAllBodyScrollLocks()
    }
  }, [display])

  useEffect(() => {
    const currencyData: any = localStorage.getItem('currency_data')
    if (currencyData) setSelectedCurrency(JSON.parse(currencyData))
    getCurrencies()
    if (typeof window !== 'undefined') {
      const videos = document.querySelectorAll('video')

      if (localStorage.getItem('videoMuted')) {
        if (localStorage.getItem('videoMuted') == 'false') {
          for (const video of videos) {
            video.muted = false
          }
          setIsMute(false)
        } else {
          for (const video of videos) {
            video.muted = true
          }
          setIsMute(true)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (document.querySelectorAll('video')?.length || asPath === '/') {
        setVideoButtonShow(true)
      } else {
        setVideoButtonShow(false)
      }
    }
  }, [asPath])

  return (
    <nav className={cn(s.root, className)}>
      <div className={s.mainContainer}>
        <ul className={'list-none d-flex head-top ' + s.list}>
          <li className="currency">
            <a
              role="button"
              id="currency-btn"
              aria-label="usd"
              onClick={() => {
                if (clickEvent === 'clickOutSide') {
                  setClickEvent('')
                  setDisplay(false)
                } else {
                  setDisplay(!display)
                }
              }}
            >
              {selectedCurrency?.currency_code}
            </a>
            {display && (
              <ClickOutside
                active={display}
                onClick={(e: any) => {
                  if (e?.target?.id === 'currency-btn')
                    setClickEvent('clickOutSide')
                  setDisplay(false)
                }}
              >
                <ul
                  className="currency-list list-none flex flex-direction align-v-center"
                  ref={ref}
                >
                  {currencies.map((val: any, key: number) => (
                    <li
                      className="currency"
                      key={key}
                      onClick={() => handelCurruncyChange(val)}
                    >
                      {val?.currency_code}
                    </li>
                  ))}
                </ul>
              </ClickOutside>
            )}
          </li>
          {device === 'mobile' ? (
            <li className={'cart'} onClick={() => mobileMenu()}>
              <Link href="/cart">
                <a href="/cart">
                  {itemsCount > 0 && (
                    <span className={s.bagCount}>{itemsCount}</span>
                  )}
                  <Bag />
                </a>
              </Link>
            </li>
          ) : (
            <li className={'cart'} onClick={toggleSidebar}>
              {itemsCount > 0 && (
                <span className={s.bagCount}>{itemsCount}</span>
              )}
              <Bag />
            </li>
          )}
          <li
            className={`account ${!videoButtonShow == true ? 'no-video' : ''}`}
          >
            <Link href={customer ? '/profile' : '/login'}>
              <a
                className={cn(s.link, {
                  [s.active]: pathname === '/profile',
                })}
                onClick={() => mobileMenu()}
                aria-label="login"
              >
                <Account />
              </a>
            </Link>
          </li>
          {videoButtonShow && (
            <li
              className={`volume ${isMute ? 'is-muted' : ''}`}
              onClick={() => muteVideos()}
            >
              <Volume />
            </li>
          )}
          <li className="close" onClick={() => mobileMenu()}>
            <Cross />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default UserNav
