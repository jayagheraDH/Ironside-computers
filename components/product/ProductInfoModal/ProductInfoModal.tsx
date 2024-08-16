import { FC, useRef, useEffect, useState } from 'react'
import { Portal } from '@reach/portal'
import { Cross } from '@components/icons'
import Slider from 'react-slick'
interface Props {
  text?: any
  productImages?: any
  button?: any
  heading?: any
  open?: boolean
  stock?: boolean
  onClose: () => void
  onEnter?: () => void | null
}

const ProductInfoModal: FC<Props> = ({
  text,
  productImages,
  button,
  heading,
  open,
  stock,
}: any) => {
  const [showModal, setShowModal] = useState(false)
  const [nav1, setNav1] = useState<any>(null)
  const [nav2, setNav2] = useState<any>(null)
  const [slider1, setSlider1] = useState(null)
  const [slider2, setSlider2] = useState(null)

  useEffect(() => {
    setNav1(slider1)
    setNav2(slider2)
  })
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>
  const settingsMain = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav',
  }

  const settingsThumbs = {
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    swipeToSlide: true,
    focusOnSelect: true,
    infinite: false,
  }

  useEffect(() => {
    const keyDownHandler = (event: {
      key: string
      preventDefault: () => void
    }) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setShowModal(false)
      }
    }

    document.addEventListener('keydown', keyDownHandler)

    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [])

  return (
    <>
      <div
        className={
          stock == true
            ? 'stock-checker'
            : 'flex align-v-center justify-space-end stock-out stock-checker'
        }
      >
        {!stock && <p className="out-of-stock-hihglighter">Out Of Stock</p>}
        <span
          className="desc-dots modal-open flex justify-end"
          onClick={() => setShowModal(true)}
        >
          {button}
        </span>
      </div>
      <Portal>
        <div>
          <div role="dialog">
            {showModal ? (
              <>
                <div className="modal product-modal" data-lenis-prevent>
                  <div className="w-100">
                    <div className="product-thumbnail flex flex-direction justify-center items-center">
                      <Slider
                        className="product-thumbnail-main"
                        {...settingsMain}
                        asNavFor={nav2}
                        ref={(slider: any) => setSlider1(slider)}
                      >
                        {productImages?.map((imgSrc: any, index: number) => {
                          return (
                            <div key={index}>
                              <img
                                src={imgSrc}
                                alt={heading}
                                height="309px"
                                width="400px"
                              />
                            </div>
                          )
                        })}
                      </Slider>
                      {productImages.length >= 2 ? (
                        <Slider
                          className="product-thumbnails"
                          {...settingsThumbs}
                          asNavFor={nav1}
                          ref={(slider: any) => setSlider2(slider)}
                        >
                          {productImages?.map((imgSrc: any, index: number) => {
                            return (
                              <div key={index}>
                                <img
                                  className="hi"
                                  src={imgSrc}
                                  alt={heading}
                                  height="309px"
                                  width="400px"
                                />
                              </div>
                            )
                          })}
                        </Slider>
                      ) : (
                        ''
                      )}
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      aria-label="Close panel"
                      className="modal-close hover:text-gray-500 transition ease-in-out duration-150 focus:outline-none absolute right-0 top-0 m-6"
                    >
                      <Cross className="h-6 w-6" />
                    </button>
                    <div className="product-thumbnail-content">
                      <div className="product-thumbnail-content-heading">
                        <h2>{heading}</h2>
                      </div>
                      {text ? (
                        <div className="product-description" data-lenis-prevent>
                          <div dangerouslySetInnerHTML={{ __html: text }} />
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </Portal>
    </>
  )
}
export default ProductInfoModal
