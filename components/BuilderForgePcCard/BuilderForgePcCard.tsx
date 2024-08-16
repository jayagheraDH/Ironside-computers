import React, { useState } from 'react'
import Slider, { Settings } from 'react-slick'
import useSearch from '@framework/products/use-search'
import Intel_logo_white from '../../public/Intel_logo_white.png'

const BuilderForgePcCard = (props: any) => {
  const data = props?.forgePcListing?.value?.data
  const [processor, setProcessor] = useState('intel')
  const [isHovering, setIsHovering] = useState<number>(-1)
  const handleMouseEnter = (index: number) => {
    setIsHovering(index)
  }
  const handleMouseLeave = () => {
    setIsHovering(-1)
  }

  const settings: Settings = {
    speed: 400,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
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
          slidesToShow: 4,
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
    ],
  }

  if (typeof window !== 'undefined') {
    document.querySelector('#body')?.setAttribute('data-theme', 'dark')
    document.querySelector('html')?.removeAttribute('data-theme')
  }

  return (
    <div>
      <div className="forge-listing">
        <div className="forge-pc-desktop">
          <Slider {...settings} className="level list-none flex align-v-center">
            {data?.list?.map((list: any, index: any) => {
              const myStyle = {
                borderColor: isHovering === index ? `${list?.color}` : '',
              }
              const data = useSearch({
                search: `${list?.product?.options?.product}`,
              })
              const url = data.data?.products[0].node.path
              return (
                <div
                  className={'box-listing ' + isHovering}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className="flex flex-direction justify-space"
                    style={myStyle}
                  >
                    <div>
                      <img src={list.image} className="box-listing-logo" />
                      <p className="box-listing-series-name">
                        {list?.seriesDescription}
                      </p>
                      <p className="box-listing-name">{list?.description}</p>
                    </div>
                    <p className="learn-more mb-0">
                      <a
                        href={
                          list?.product?.options?.product
                            ? `/customizer${url ? url : ''}`
                            : '/'
                        }
                        style={{ color: list?.color }}
                      >
                        Customize
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="9"
                          viewBox="0 0 12 9"
                          style={{ fill: list.color }}
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M0.691406 4.47168C0.691406 4.19554 0.915264 3.97168 1.19141 3.97168H11.0286C11.3047 3.97168 11.5286 4.19554 11.5286 4.47168C11.5286 4.74782 11.3047 4.97168 11.0286 4.97168H1.19141C0.915264 4.97168 0.691406 4.74782 0.691406 4.47168Z"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.7302 0.521888C6.91659 0.318139 7.23286 0.304066 7.43661 0.490454L11.3984 4.11467C11.5019 4.20939 11.5609 4.34326 11.5609 4.48359C11.5609 4.62392 11.5019 4.7578 11.3984 4.85251L7.43661 8.47673C7.23286 8.66312 6.91659 8.64905 6.7302 8.4453C6.54381 8.24155 6.55788 7.92528 6.76163 7.73889L10.3201 4.48359L6.76163 1.2283C6.55788 1.04191 6.54381 0.725638 6.7302 0.521888Z"
                          />
                        </svg>
                      </a>
                    </p>
                  </div>
                </div>
              )
            })}
          </Slider>
        </div>
        {/* Code For Mobile Tabs*/}
        <div className="forge-pc-mobile">
          {/* <div className="flex align-v-center">
            <button
              className={`customize-toggle ${
                processor == 'amd' ? 'true amd' : 'amd'
              }`}
              onClick={() => setProcessor('amd')}
            >
              <img src="https://cdn.builder.io/api/v1/image/assets%2Ff6d91abf288f4e5fb3b6f1e8b846274b%2Fdb84d007fb184af2b6851c3bd877293d" />
            </button>
            <button
              className={`customize-toggle ${
                processor == 'intel' ? 'true' : ''
              }`}
              onClick={() => setProcessor('intel')}
            >
              <img src={Intel_logo_white.src} />
            </button>
          </div> */}
          <div className="processor flex flex-wrap">
            {data?.list?.map((list: any, index: any) => {
              const myStyle = {
                borderColor: isHovering === index ? `${list?.color}` : '',
              }
              return (
                <>
                  {list?.processor && (
                    <div
                      className={'box-listing ' + isHovering}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div
                        className="flex flex-direction justify-space"
                        style={myStyle}
                      >
                        <div>
                          <img src={list.image} className="box-listing-logo" />
                          <p className="box-listing-series-name">
                            {list?.seriesDescription}
                          </p>
                          <p className="box-listing-name">
                            {list?.description}
                          </p>
                        </div>
                        <p className="learn-more mb-0">
                          <a href="" style={{ color: list.color }}>
                            Customize
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="9"
                              viewBox="0 0 12 9"
                              style={{ fill: list.color }}
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M0.691406 4.47168C0.691406 4.19554 0.915264 3.97168 1.19141 3.97168H11.0286C11.3047 3.97168 11.5286 4.19554 11.5286 4.47168C11.5286 4.74782 11.3047 4.97168 11.0286 4.97168H1.19141C0.915264 4.97168 0.691406 4.74782 0.691406 4.47168Z"
                              />
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6.7302 0.521888C6.91659 0.318139 7.23286 0.304066 7.43661 0.490454L11.3984 4.11467C11.5019 4.20939 11.5609 4.34326 11.5609 4.48359C11.5609 4.62392 11.5019 4.7578 11.3984 4.85251L7.43661 8.47673C7.23286 8.66312 6.91659 8.64905 6.7302 8.4453C6.54381 8.24155 6.55788 7.92528 6.76163 7.73889L10.3201 4.48359L6.76163 1.2283C6.55788 1.04191 6.54381 0.725638 6.7302 0.521888Z"
                              />
                            </svg>
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuilderForgePcCard
