import React, { useEffect, useState } from 'react'
import Slider, { Settings } from 'react-slick'
import amdLogo from '../../public/AMD_Logo .png'
import Intel_logo_white from '../../public/Intel_logo_white.png'
import Intel_logo_black from '../../public/Intel_logo_black.png'
import useSearch from '@framework/products/use-search'
import Link from 'next/link'
import usePrice from '@commerce/use-price'

const BuilderProductListingWithTab = (props: any) => {
  const data = props?.productlistingWithTab?.value?.data
  const [processor, setProcessor] = useState('amd')
  const [theme, setTheme] = useState('black')
  const [currency, setCurrency] = useState<any>({})
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bodyTheme: any = document
        .querySelector('body')
        ?.getAttribute('data-theme')
      setTheme(bodyTheme)
    }
    const currencyData: any = localStorage.getItem('currency_data')
    setCurrency(JSON.parse(currencyData))
  }, [])
  const getProductUrl = (productId: string) => {
    const product = useSearch({ search: productId }).data?.products[0]?.node
    const url = product?.path
    const { price: total } = usePrice(
      data && {
        amount: product?.prices?.price?.value,
        currencyCode: currency?.currency_code ? currency?.currency_code : 'USD',
        currencyExchange: currency?.currency_exchange_rate
          ? parseFloat(currency?.currency_exchange_rate)
          : 1,
      }
    )
    return { url, total }
  }
  data?.intel?.forEach((ele: any, index: number) => {
    if (ele?.productUrl) {
      const { url, total } = getProductUrl(ele?.productUrl?.options?.product)
      if (url) {
        data.intel[index]['levelPrice'] = total
        data.intel[index]['url'] = url
      }
    }
  })
  data?.amd?.forEach((ele: any, index: number) => {
    if (ele?.productUrl) {
      const { url, total } = getProductUrl(ele?.productUrl?.options?.product)
      if (url) {
        data.amd[index]['levelPrice'] = total
        data.amd[index]['url'] = url
      }
    }
  })

  const settings: Settings = {
    speed: 400,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    variableWidth: true,
    nextArrow: (
      <button type="button" className="slick-next">
        <svg
          width="22"
          height="17"
          viewBox="0 0 22 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 8.36841C0 7.81612 0.447715 7.36841 1 7.36841H21C21.5523 7.36841 22 7.81612 22 8.36841C22 8.92069 21.5523 9.36841 21 9.36841H1C0.447715 9.36841 0 8.92069 0 8.36841Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.3744 0.317685C12.7513 -0.0860653 13.384 -0.107885 13.7878 0.268948L21.6825 7.63737C21.8852 7.8265 22.0002 8.09124 22.0002 8.36843C22.0002 8.64561 21.8852 8.91036 21.6825 9.09948L13.7878 16.4679C13.384 16.8447 12.7513 16.8229 12.3744 16.4192C11.9976 16.0154 12.0194 15.3826 12.4232 15.0058L19.5346 8.36843L12.4232 1.73106C12.0194 1.35422 11.9976 0.721436 12.3744 0.317685Z"
            fill="white"
          />
        </svg>
      </button>
    ),
    prevArrow: (
      <button type="button" className="slick-next">
        <svg
          width="22"
          height="17"
          viewBox="0 0 22 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 8.36841C0 7.81612 0.447715 7.36841 1 7.36841H21C21.5523 7.36841 22 7.81612 22 8.36841C22 8.92069 21.5523 9.36841 21 9.36841H1C0.447715 9.36841 0 8.92069 0 8.36841Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.3744 0.317685C12.7513 -0.0860653 13.384 -0.107885 13.7878 0.268948L21.6825 7.63737C21.8852 7.8265 22.0002 8.09124 22.0002 8.36843C22.0002 8.64561 21.8852 8.91036 21.6825 9.09948L13.7878 16.4679C13.384 16.8447 12.7513 16.8229 12.3744 16.4192C11.9976 16.0154 12.0194 15.3826 12.4232 15.0058L19.5346 8.36843L12.4232 1.73106C12.0194 1.35422 11.9976 0.721436 12.3744 0.317685Z"
            fill="white"
          />
        </svg>
      </button>
    ),
    responsive: [
      {
        breakpoint: 1441,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
          // variableWidth: false,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 860,
        settings: 'unslick',
      },
    ],
  }

  const renderListing = (pro: string) => {
    const products = data
      ? pro === 'amd'
        ? [...data?.amd]
        : [...data?.intel]
      : []
    return (
      <Slider
        {...settings}
        className="level list-none flex align-v-center flex-wrap custom-slick-arrows"
      >
        {products?.map((level: any, index: any) => {
          const splitDescription = level?.levelDescription.split(',')
          return (
            <>
              {level?.url ? (
                <Link href={`/customizer${level?.url}`}>
                  <a href={`/customizer${level?.url}`}>
                    <div className="box-listing" key={index}>
                      <p className="level-name">{level?.levelName}</p>
                      <p className="level-description">
                        {splitDescription.map((data: any, index: any) => (
                          <div key={index}>
                            {data} <br />
                          </div>
                        ))}
                      </p>
                      <p className=" mb-0">{level?.levelPrice}</p>
                    </div>
                  </a>
                </Link>
              ) : (
                <Link href={`/`}>
                  <a href="/">
                    <div className="box-listing" key={index}>
                      <p className="level-name">{level?.levelName}</p>
                      <p className="level-description">
                        {splitDescription.map((data: any, index: any) => (
                          <div key={index}>
                            {data} <br />
                          </div>
                        ))}
                      </p>
                    </div>
                  </a>
                </Link>
              )}
            </>
          )
        })}
      </Slider>
    )
  }

  return (
    <div className="model listing-tab flex w-100">
      <div className="bg-img">
        <img src={data?.modelBgImage} alt={data?.modelName} />
      </div>
      <img
        src={data?.modelImage}
        className="product-img"
        alt={data?.modelName}
      />
      <div className="model-listing justify-center flex-direction">
        <div className="customize-header flex align-v-center justify-space">
          <h3 className="mb-0">{data?.modelName}</h3>
          <div className="flex align-v-center">
            <button
              className={`customize-toggle ${processor == 'amd' ? 'true' : ''}`}
              onClick={() => setProcessor('amd')}
            >
              <img src={amdLogo.src} />
            </button>
            <button
              className={`customize-toggle ${
                processor == 'intel' ? 'true' : ''
              }`}
              onClick={() => setProcessor('intel')}
            >
              <img
                src={
                  theme === 'light'
                    ? Intel_logo_black.src
                    : Intel_logo_white.src
                }
              />
            </button>
          </div>
        </div>
        <div className="level-listing">
          {processor === 'amd' ? renderListing('amd') : renderListing('intel')}
        </div>
      </div>
    </div>
  )
}

export default BuilderProductListingWithTab
