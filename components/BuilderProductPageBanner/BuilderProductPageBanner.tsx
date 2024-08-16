import React, { useState } from 'react'
import Slider, { Settings } from 'react-slick'

const BuilderProductPageBanner = (props: any) => {
  const data = props?.banner?.value?.data
  const [variant, setvariant] = useState(0)
  const [active, setActive] = useState(true)

  const handleClick = (index: any) => {
    setvariant(index)
    setActive(!active)
  }
  const settings: Settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    centerMode: true,
    centerPadding: '0',
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <div className="product-banner flex justify-center align-v-center">
      <img src={data?.bgImage} alt={data?.productHeading} className="bg-img" />

      <div className="product-banner-left custom-slick-dots">
        <Slider {...settings}>
          {data?.variants[variant].variantImages?.map(
            (img: any, index: number) => (
              <div key={index} className="img">
                <img
                  src={img.image}
                  alt={data?.variants[variant].variantName}
                />
              </div>
            )
          )}
        </Slider>
      </div>
      <div className="product-banner-right flex flex-direction justify-center text-center">
        <h2 className="fs-48">{data?.productHeading}</h2>
        <p className="banner-description mb-0 ls-96">
          {data?.productDescription}
        </p>
        <div className="variant-order">
          <p className="variant-label">Variants</p>
          <p className="variants-name mb-0">
            {data?.variants[variant].variantName}
          </p>
          <div className="variants flex justify-center">
            {data?.variants?.map((detail: any, index: any) => (
              <div key={index}>
                <div className={`${variant == index ? 'true' : ''}`}>
                  <span
                    style={{ backgroundColor: detail?.colorPalette }}
                    className="colorPalette"
                    onClick={() => handleClick(index)}
                  ></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuilderProductPageBanner
