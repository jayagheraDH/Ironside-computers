import Portal from '@reach/portal'
import React, { useState } from 'react'
import Slider, { Settings } from 'react-slick'

const BuilderGallery = (props: any) => {
  const [showModal, setShowModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const data = props?.gallery?.value?.data
  const settings: Settings = {
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    variableWidth: true,
    swipeToSlide: true,
    rows: 2,
    arrows: false,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          variableWidth: true,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          variableWidth: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          variableWidth: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          rows: 4,
          slidesToShow: 3,
          slidesToScroll: 1,
          variableWidth: true,
        },
      },
    ],
  }
  const handleImageClick = (image: string) => {
    setSelectedImage(image)
    setShowModal(true)
  }
  return (
    <div className="imageGallery">
      <Slider {...settings}>
        {data?.images?.map((link: any, index: any) => (
          <div key={index} className="slide">
            <a
              // onClick={() => handleImageClick(link.image)}
            >
              <img
                src={link.image}
                alt="gallery"
                height="278px"
                width="278px"
              />
              {data?.enableTitles && <h4>{link?.imageHeading}</h4>}
            </a>
          </div>
        ))}
      </Slider>
      <Portal>
        {showModal && (
          <div className="gallery-modal">
            <div className="img">
              <img src={selectedImage} alt="modal" />
            </div>
            <span className="close" onClick={() => setShowModal(false)}>
              Close
            </span>
          </div>
        )}
      </Portal>
    </div>
  )
}

export default BuilderGallery
