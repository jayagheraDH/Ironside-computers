import $ from 'jquery'
import { useEffect, useState } from 'react'
import cn from 'classnames'
import Select from 'react-select'
import usePrice from '@framework/use-price'
import useUpdateItem from '@framework/cart/use-update-item'
import useRemoveItem from '@framework/cart/use-remove-item'
import './CartItem.module.css'
import SaveBuildModal from '@components/ui/SaveBuildModal/SaveBuildModal'
import { ToastContainer, toast, Flip } from 'react-toastify'

type ItemOption = {
  name: string
  nameId: number
  value: string
  valueId: number
}

const CartItem = ({
  item,
  currency,
  itemIndex,
}: {
  item: any
  currency: any
  itemIndex: number
}) => {
  const { price } = usePrice({
    amount: item.extended_sale_price,
    baseAmount: item.extended_list_price,
    currencyCode: currency?.currency_code ? currency?.currency_code : 'USD',
    currencyExchange: currency?.currency_exchange_rate
      ? parseFloat(currency?.currency_exchange_rate)
      : 1,
  })
  const updateItem = useUpdateItem(item)
  const removeItem = useRemoveItem()
  const [quantity, setQuantity] = useState(item.quantity)
  const [removing, setRemoving] = useState(false)
  const [saveMyBuildModal, setSaveMyBuildModal] = useState(false)
  const notify = () => {
    toast.error('Insufficient stock')
  }

  const increaseQuantity = async (qty: number) => {
    const val = qty

    if (Number.isInteger(val) && val >= 0) {
      setQuantity(val)
      try {
        await updateItem({ quantity: val })
      } catch (error: any) {
        console.error(error?.errors)
      }
    }
  }
  useEffect(() => {
    $(document).on('CART_ERROR', () => {
      const errData: any = localStorage.getItem('cartErr')
      if (errData) {
        notify()
        localStorage.removeItem('cartErr')
      }
    })
  }, [])

  const handleRemove = async () => {
    setRemoving(true)

    try {
      // If this action succeeds then there's no need to do `setRemoving(true)`
      // because the component will be removed from the view
      await removeItem({ id: item.id })
    } catch (error) {
      setRemoving(false)
    }
  }

  useEffect(() => {
    // Reset the quantity state if the item quantity changes
    if (item.quantity !== Number(quantity)) {
      setQuantity(item.quantity)
    }
  }, [item.quantity])

  const itemsObject: any = {}
  item?.options?.forEach((ele: any) => {
    itemsObject[ele.nameId] = ele.valueId ? ele.valueId : ele.value
  })
  const searchParams = new URLSearchParams(itemsObject)

  const options = [
    {
      value: 1,
      label: 1,
    },
    {
      value: 2,
      label: 2,
    },
    {
      value: 3,
      label: 3,
    },
    {
      value: 4,
      label: 4,
    },
    {
      value: 5,
      label: 5,
    },
    {
      value: 6,
      label: 6,
    },
    {
      value: 7,
      label: 7,
    },
    {
      value: 8,
      label: 8,
    },
    {
      value: 9,
      label: 9,
    },
    {
      value: 10,
      label: 10,
    },
  ]

  return (
    <>
      <li
        className={cn('cart-listing-item flex flex-direction flex-row', {
          'opacity-75 pointer-events-none': removing,
        })}
      >
        <div className="cart-item-detail flex flex-wrap align-v-center">
          <div className="cart-item-detail-image">
            <img
              src={item.image_url}
              width={150}
              height={150}
              alt="Product Image"
            />
          </div>
          <div className="cart-item-detail-heading">
            {/** TODO: Replace this. No `path` found at Cart */}
            {item?.name?.split('|').length > 1 ? (
              <>
                <span className="cart-list-name">
                  {item.name.split('|')[0]}
                </span>
                <span className="cart-list-category-name">
                  {item.name.split('|')[1]}
                </span>
              </>
            ) : (
              <span className="cart-list-name">{item.name}</span>
            )}
          </div>
          <div className="cart-item-detail-qty flex flex-direction">
            <span className="item-label">Qty</span>
            <Select
              className="select-2 required-field"
              options={options}
              value={{ value: quantity, label: quantity }}
              onChange={(selectedOption: any) => {
                increaseQuantity(selectedOption.value)
              }}
            />
          </div>
          <div className="flex flex-col text-base">
            <span className="item-label">Total</span>
            <span className="item-price">{price}</span>
          </div>
          <div className="cart-edit-detail-options flex align-start justify-end flex-1">
            <a
              href={
                item?.options?.length >= 2
                  ? `/customizer/${item.url.split('/')[3]}?${
                      searchParams.toString() + `&cIn=${itemIndex}`
                    }`
                  : 'merch-gears'
              }
            >
              EDIT
            </a>
            <button onClick={() => setSaveMyBuildModal(true)}>SAVE</button>
            <button onClick={handleRemove}>DELETE</button>
          </div>
        </div>
        {item.options && item.options.length > 0 ? (
          <div className="cart-options">
            <p className="cart-option-details"> Details </p>
            <ul className="m-0">
              {item?.options?.map((option: ItemOption, i: number) => (
                <li key={i} className="text-sm font-semibold text-accents-7">
                  <p className="options-details mb-0">
                    <span>{option.name}</span> {option.value}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </li>
      {saveMyBuildModal && (
        <SaveBuildModal
          url={
            item?.options?.length >= 2
              ? `${window.location.origin}/customizer/${
                  item.url.split('/')[3]
                }?${searchParams.toString()}`
              : `${window.location.origin}/merch-gears`
          }
          options={item?.options}
          totalPrice={price}
          setSaveMyBuildModal={setSaveMyBuildModal}
          productImage={item.image_url}
          productDescription={item.name.split('|')}
        />
      )}
      <ToastContainer
        transition={Flip}
        position="bottom-right"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
      />
    </>
  )
}

export default CartItem
