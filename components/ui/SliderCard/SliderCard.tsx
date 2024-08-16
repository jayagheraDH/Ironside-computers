import React, { useState } from 'react'

const SliderCard = ({
  index,
  title,
  description,
  price,
  link,
  imgSrc,
  badgeName,
  colorPicker,
  videoUrl,
  convertCurrency,
}: any) => {
  const [productImage, setProductImage] = useState(imgSrc)
  const [playVideo, setPlayVideo] = useState(false)
  const handleColorChange = (colorOption: any) => {
    setProductImage(colorOption?.image ? colorOption?.image : imgSrc)
  }

  return (
    <div className="product-card">
      <div className="product-content">
        <div className="productCardImage">
          <a href={link ? link : '#'}>
            {videoUrl ? (
              <>
                <video
                  id={index}
                  height=""
                  autoPlay
                  playsInline
                  loop
                  width=""
                  muted
                  poster={productImage}
                >
                  <source src={videoUrl} />
                </video>
              </>
            ) : (
              <img src={productImage} alt={title} height="" width="" />
            )}
          </a>
        </div>
        <div className="productCardContent flex align-v-center justify-space">
          <div>
            <h3>
              <a href={link ? link : '#'}>{title}</a>
            </h3>
            {badgeName && (
              <div className="new-tag">
                <p className="mb-0">{badgeName}</p>
              </div>
            )}
            <p className="product-desc mb-0">{description}</p>
          </div>
          <div className="flex flex-direction align-end">
            <div className="color-dots flex">
              {colorPicker?.map((colorPicker: any, index: any) => (
                <span
                  key={index}
                  style={{ backgroundColor: colorPicker.color }}
                  onClick={() => handleColorChange(colorPicker)}
                ></span>
              ))}
            </div>
            <p className="product-price text-right mb-0">
              Starts at <span>{convertCurrency(price)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SliderCard
