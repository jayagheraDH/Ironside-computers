import React, { useState } from 'react'
import { Portal } from '@reach/portal'
import { ToastContainer, toast, Flip } from 'react-toastify'
import { Cross } from '@components/icons'
import { useUI } from '@components/ui/context'
import { ProductInfoModal } from '@components/product'
import EmptyProduct from '@components/icons/EmptyProduct'
import DropdownArrow from '@components/icons/DropdownArrow'
import Image from 'next/image'
const ProductSelectionModal = ({
  setModal,
  modalData,
  selectedIds,
  onOptionSelections,
  selectedColor,
  colorOpts,
  convertCurrency,
  setIncompatibleProducts,
  incompatibleProdIds,
  setIncompatibleProdIds,
  setIncompatibleCats,
  optionSelections,
  scrollToElement,
  activeTab,
  defaultColors,
  setDefaultColors,
  productOptions,
}: any) => {
  const { displayModal, closeModal } = useUI()
  const [toggle, setToggle] = useState(false)
  const [toggleIndex, setToggleIndex] = useState('')
  const productInfoImages = (data: any) => {
    const images = data?.images?.edges.map((image: any) => {
      return image?.node?.urlOriginal
    })
    return images
  }
  let isMerch = false

  modalData?.products[1]?.categories?.edges?.forEach((ele: any) => {
    if (ele.node.name === 'Merch') isMerch = true
  })
  const notify = () => {
    toast.error('Insufficient stock')
  }

  const handleColorSelection = (data: any, color: { node: any }) => {
    let isStockOut = false
    colorOpts?.forEach((option: any) => {
      if (option.entityId == color?.node.value.split(',')[2]) {
        if (!option?.variants.edges[0].node.inventory.isInStock) {
          isStockOut = true
          notify()
          return
        } else {
          const colorSelection = [...defaultColors]
          colorSelection?.forEach((clr: any) => {
            if (clr?.entityId === data?.entityId) clr['color'] = option
          })
          const hasMemoryCategory = colorSelection?.some(
            (item: any) =>
              item.categoryName === data?.categories?.edges[0]?.node?.name
          )
          if (!hasMemoryCategory) {
            const temp = {
              entityId: data?.entityId,
              categoryName: data?.categories?.edges[0]?.node?.name,
              price: data?.prices.price.value,
              color: option,
            }
            colorSelection.push(temp)
            setDefaultColors([...colorSelection])
          } else {
            setDefaultColors([...colorSelection])
          }
          setIncompatibleProducts({})
          setIncompatibleProdIds([])
          setIncompatibleCats([])
          onOptionSelections(
            data?.entityId,
            modalData?.categoryName,
            option?.prices.price.value,
            option
          )
        }
      }
    })
    if (!isStockOut) {
      setToggle(false)
      scrollToElement(activeTab, true)
      setModal(false)
    }
  }

  const renderPrice = (data: any) => {
    let price = 0
    optionSelections?.forEach((option: any) => {
      data?.categories?.edges?.forEach((ele: any) => {
        if (ele?.node?.name === option.category_name) {
          price = data?.prices.price.value - option?.productPrice
        }
      })
    })
    let varaintPrice = 0
    if (selectedColor?.length) {
      selectedColor.forEach((color: any) => {
        if (color?.parent_id === data?.entityId) {
          varaintPrice = color.productPrice
        } else {
          if (data?.customFields?.edges?.length) {
            colorOpts?.forEach((options: any) => {
              if (
                data?.customFields?.edges[0]?.node?.value?.split(',')[2] ==
                options?.entityId
              ) {
                varaintPrice =
                  options?.prices.price.value - data?.prices?.price?.value
                selectedColor.forEach((ele: any) => {
                  if (ele?.parent_id === data?.entityId) {
                    varaintPrice =
                      options?.prices.price.value - ele?.productPrice
                    if (ele?.product_name === options?.name) {
                      varaintPrice = 0
                    }
                  }
                })
              }
            })
          }
        }
      })
    }
    const finalPrice = price + varaintPrice
    return (
      <p className="case-price mb-0">
        {finalPrice?.toString().includes('-')
          ? convertCurrency(finalPrice)
          : `+${convertCurrency(finalPrice)}`}
      </p>
    )
  }

  const renderColorPrice = (options: any, data: any) => {
    let optionAmout = 0
    optionSelections?.forEach((option: any) => {
      data?.categories?.edges?.forEach((ele: any) => {
        if (ele?.node?.name === option.category_name) {
          optionAmout = data?.prices.price.value - option?.productPrice
        }
      })
    })
    let price: any = options?.prices.price.value - data?.prices?.price?.value
    selectedColor.forEach((ele: any) => {
      if (ele?.parent_id === data?.entityId) {
        price = options?.prices.price.value - ele?.productPrice
        if (ele?.product_name === options?.name) {
          price = undefined
        }
      }
    })
    const finalPrice = price + optionAmout
    if (finalPrice?.toString().includes('-')) {
      if (price === undefined) return
      return <span> {convertCurrency(finalPrice)}</span>
    } else {
      if (price === undefined) return
      return <span> +{convertCurrency(finalPrice)}</span>
    }
  }

  const loadImage = (prod: any) => {
    let image = ''
    defaultColors?.forEach((opt: any) => {
      if (prod?.entityId === opt?.entityId) {
        prod?.customFields?.edges.map((field: any) => {
          if (field?.node?.value.split(',')[2] == opt?.color?.entityId) {
            image = opt?.color.images.edges[0].node.urlOriginal
          }
        })
      }
    })
    // selectedColor.forEach((color: any) => {
    //   if (color?.parent_id === prod?.entityId) {
    //     image = color?.product_image
    //   }
    // })
    if (image === '') image = prod?.images?.edges[0]?.node?.urlOriginal
    return image
  }

  const renderColorName = (data: any, categoryName: string) => {
    let color: any = {}
    let colorName = data.customFields.edges[0].node.value
    selectedColor?.forEach((ele: any) => {
      data?.customFields?.edges.map((field: any) => {
        if (
          field?.node?.value.split(',')[2] == ele?.product_id &&
          ele?.category_name === categoryName
        ) {
          color = field?.node
        }
      })
    })
    if (color?.entityId) {
      colorName = color?.value
      return colorName
    } else {
      defaultColors?.forEach((opt: any) => {
        if (data?.entityId === opt?.entityId) {
          data?.customFields?.edges.map((field: any) => {
            if (field?.node?.value.split(',')[2] == opt?.color?.entityId) {
              color = field?.node
            }
          })
        }
      })
      if (color?.entityId) {
        colorName = color?.value
      }
      return colorName
    }
  }

  return (
    <div className="category-popup">
      <div className="product-thumbnail-content flex justify-space align-start">
        <h2>{modalData?.categoryName}</h2>
        <button
          onClick={() => {
            scrollToElement(activeTab, true)
            setModal(false)
          }}
          aria-label="Close panel"
          className="close"
        >
          <Cross className="h-6 w-6" />
        </button>
      </div>
      <div className="flex flex-wrap spacer-6">
        {modalData?.products?.map((data: any, index: number) => (
          <div
            className={
              data?.variants?.edges[0]?.node?.inventory?.isInStock
                ? 'product-square'
                : 'product-square stock-out'
            }
            key={index}
          >
            <div
              className={
                selectedIds?.some(
                  (product: any) =>
                    product?.product === data?.entityId &&
                    product?.cat === modalData?.categoryName
                )
                  ? `product-square-box productSelected ${
                      incompatibleProdIds?.some(
                        (id: any) => id === data?.entityId
                      ) && 'incompatible'
                    }`
                  : 'product-square-box'
              }
            >
              <ProductInfoModal
                open={displayModal}
                onClose={closeModal}
                heading={<>{data?.name}</>}
                text={data?.description}
                button={<>...</>}
                productImages={productInfoImages(data)}
                stock={data?.variants?.edges[0]?.node?.inventory?.isInStock}
              />

              {data?.images?.edges.length ? (
                data?.customFields?.edges.length === 0 || isMerch ? (
                  <div
                    className="options-internal-image flex align-v-center justify-center"
                    onClick={() => {
                      data?.variants.edges[0]?.node?.inventory?.isInStock
                        ? (function () {
                            setIncompatibleProducts({})
                            setIncompatibleProdIds([])
                            setIncompatibleCats([])
                            onOptionSelections(
                              data?.entityId,
                              modalData?.categoryName,
                              data?.prices?.price?.value
                            )
                            scrollToElement(activeTab, true)
                            setModal(false)
                          })()
                        : notify()
                    }}
                  >
                    <Image
                      priority={true}
                      height={154}
                      width={105}
                      src={data?.images?.edges[0]?.node?.urlOriginal}
                    />
                  </div>
                ) : (
                  <div
                    className="options-internal-image flex align-v-center justify-center"
                    onClick={() => {
                      setToggleIndex(index.toString())
                      setToggle(true)
                    }}
                  >
                    <Image
                      priority={true}
                      height={154}
                      width={105}
                      src={loadImage(data)}
                    />
                  </div>
                )
              ) : (
                <div
                  className="options-internal-image flex align-v-center justify-center"
                  onClick={() => {
                    data?.variants.edges[0]?.node?.inventory?.isInStock
                      ? (function () {
                          setIncompatibleProducts({})
                          setIncompatibleProdIds([])
                          setIncompatibleCats([])
                          onOptionSelections(
                            data?.entityId,
                            modalData?.categoryName,
                            data?.prices?.price?.value
                          )
                          scrollToElement(activeTab, true)
                          setModal(false)
                        })()
                      : notify()
                  }}
                >
                  <EmptyProduct />
                </div>
              )}
              <div className="flex flex-direction justify-space">
                {data?.customFields?.edges.length === 0 || isMerch ? (
                  <h3
                    key={index}
                    onClick={() => {
                      data?.variants.edges[0]?.node?.inventory?.isInStock
                        ? (function () {
                            setIncompatibleProducts({})
                            setIncompatibleProdIds([])
                            setIncompatibleCats([])
                            onOptionSelections(
                              data?.entityId,
                              modalData?.categoryName,
                              data?.prices?.price?.value
                            )
                            scrollToElement(activeTab, true)
                            setModal(false)
                          })()
                        : notify()
                    }}
                  >
                    {data?.name.length > 23
                      ? `${data?.name?.substring(0, 23)}...`
                      : data?.name}
                  </h3>
                ) : (
                  <h3 key={index}>
                    {data?.name.length > 23
                      ? `${data?.name?.substring(0, 23)}...`
                      : data?.name}
                  </h3>
                )}

                <div className="flex align-v-center justify-space">
                  <>
                    {data?.customFields?.edges.length < 2 && !isMerch ? (
                      <div className="color-pattel flex w-100">
                        {!selectedIds?.some(
                          (product: any) =>
                            product?.product === data?.entityId &&
                            product?.cat === modalData?.categoryName
                        ) && (
                          <p className="case-price mb-0">{renderPrice(data)}</p>
                        )}
                      </div>
                    ) : (
                      <>
                        {toggle && parseInt(toggleIndex) === index && (
                          <div className="colorPattelListSelect">
                            <span
                              className="flex justify-end"
                              onClick={() => setToggle(false)}
                            >
                              <Cross />
                            </span>
                            <ul className="list-none">
                              {data?.customFields?.edges?.map(
                                (color: any, index: number) => (
                                  <>
                                    {productOptions?.map((opt: any) => {
                                      if (
                                        opt?.node?.displayName ===
                                        modalData?.categoryName
                                      ) {
                                        return opt?.node?.values?.edges?.map(
                                          (colorData: any) => {
                                            if (
                                              colorData?.node?.productId ==
                                              color?.node?.value.split(',')[2]
                                            )
                                              return (
                                                <li key={index}>
                                                  <p
                                                    className="mb-0"
                                                    onClick={() => {
                                                      handleColorSelection(
                                                        data,
                                                        color
                                                      )
                                                    }}
                                                  >
                                                    <span
                                                      className="colorPattelListBg"
                                                      style={{
                                                        backgroundColor:
                                                          color?.node?.value?.split(
                                                            ','
                                                          )[1],
                                                      }}
                                                    ></span>
                                                    {
                                                      color?.node?.value?.split(
                                                        ','
                                                      )[0]
                                                    }
                                                    {colorOpts?.map(
                                                      (options: any) => {
                                                        if (
                                                          color?.node?.value?.split(
                                                            ','
                                                          )[2] ==
                                                          options?.entityId
                                                        ) {
                                                          return renderColorPrice(
                                                            options,
                                                            data
                                                          )
                                                        }
                                                      }
                                                    )}
                                                  </p>
                                                </li>
                                              )
                                          }
                                        )
                                      }
                                    })}
                                  </>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                        {isMerch && (
                          <p className="case-price mb-0">
                            {convertCurrency(data?.prices?.price?.value)}
                          </p>
                        )}
                      </>
                    )}
                  </>
                  {data?.customFields?.edges?.length >= 2 ? (
                    <>
                      <button
                        className="multiColorOption flex align-v-center justify-space"
                        onClick={() => {
                          setToggle(true)
                          setToggleIndex(index.toString())
                        }}
                      >
                        <>
                          <span
                            className="colorPattelListBg"
                            style={{
                              backgroundColor: renderColorName(
                                data,
                                modalData?.categoryName
                              ).split(',')[1],
                            }}
                          ></span>
                          {
                            renderColorName(
                              data,
                              modalData?.categoryName
                            ).split(',')[0]
                          }
                        </>
                        <span className="arrow">
                          <DropdownArrow />
                        </span>
                      </button>
                      {!selectedIds?.some(
                        (product: any) =>
                          product?.product === data?.entityId &&
                          product?.cat === modalData?.categoryName
                      ) && <>{renderPrice(data)}</>}
                    </>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Portal>
        <ToastContainer
          transition={Flip}
          position="bottom-center"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="dark"
        />
      </Portal>
    </div>
  )
}

export default ProductSelectionModal
