import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Slider, { Settings } from 'react-slick'
import useSearch from '@framework/products/use-search'
import usePrice from '@commerce/use-price'

const BuilderProductListing = (props: any) => {
  const [currency, setCurrency] = useState<any>({})
  const data = props?.productlisting?.value?.data
  const settings: Settings = {
    speed: 400,
    infinite: false,
    slidesToShow: 3,
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
          slidesToShow: 2,
          slidesToScroll: 1,
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
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 666,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          // variableWidth: false,
          arrows: true,
        },
      },
    ],
  }

  const fetchPrice = (productId: any) => {
    const product = useSearch({ search: productId }).data?.products[0]?.node
    const { price: total } = usePrice(
      data && {
        amount: product?.prices?.price?.value,
        currencyCode: currency?.currency_code ? currency?.currency_code : 'USD',
        currencyExchange: currency?.currency_exchange_rate
          ? parseFloat(currency?.currency_exchange_rate)
          : 1,
      }
    )

    return (
      <>
        <p className=" mb-0">{total}</p>
        <p className="learn-more">
          <Link href={`/customizer${product?.path}`}>
            <a href={`/customizer${product?.path}`}>Add to Cart</a>
          </Link>
        </p>
      </>
    )
  }

  useEffect(() => {
    const currencyData: any = localStorage.getItem('currency_data')
    setCurrency(JSON.parse(currencyData))
  }, [])

  return (
    <div className="model">
      <div className="bg-img">
        <img src={data?.modelBgImage} alt={data?.modelName} />
      </div>
      <div className='model-text'>
        <h3>{data?.modelName}</h3>
        <p className="desc">{data?.modelDescription}</p>
        <p className="learn-more">
          <a href={data?.learnMoreLink}>Learn More</a>
        </p>
      </div>
      <div className="model-listing">
        <img
          src={data?.modelImage}
          className="product-img"
          alt={data?.modelName}
        />
        <div className="level-listing">
          <Slider {...settings} className="level list-none flex align-v-center">
            {data?.level?.map((level: any, index: any) => {
              const splitDescription = level?.levelDescription.split(',')
              return (
                <div className="h-full">
                  <div
                    className="box-listing flex flex-direction justify-space h-full"
                    key={index}
                  >
                    <div className="h-full">
                      <p className="level-name">{level?.levelName}</p>
                      <p className="level-description">
                        {splitDescription.map((data: any, index: any) => (
                          <span key={index}>
                            {data} <br />
                          </span>
                        ))}
                      </p>
                    </div>
                    <div>
                      {level?.product?.options.product &&
                        fetchPrice(level?.product?.options.product)}
                    </div>
                  </div>
                </div>
              )
            })}
          </Slider>
        </div>
      </div>
    </div>
  )
}

export default BuilderProductListing
