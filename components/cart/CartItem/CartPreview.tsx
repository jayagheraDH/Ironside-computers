import $ from 'jquery'
import { useEffect, useState } from 'react'
import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import usePrice from '@framework/use-price'
import useUpdateItem from '@framework/cart/use-update-item'
import useRemoveItem from '@framework/cart/use-remove-item'
import Select from 'react-select'
import { ToastContainer, toast, Flip } from 'react-toastify'

const CartPreview = ({ item, currency }: { item: any; currency: any }) => {
  const { price } = usePrice({
    amount: item.extended_sale_price,
    baseAmount: item.extended_list_price,
    currencyCode: currency?.currency_code ? currency?.currency_code : 'USD',
    currencyExchange: currency?.currency_exchange_rate
      ? parseFloat(currency?.currency_exchange_rate)
      : 1,
  })

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
  const updateItem = useUpdateItem(item)
  const removeItem = useRemoveItem()
  const [quantity, setQuantity] = useState(item.quantity)
  const [removing, setRemoving] = useState(false)
  const notify = () => {
    toast.error('Insufficient stock')
  }
  const updateQuantity = async (val: number) => {
    try {
      await updateItem({ quantity: val })
    } catch (error: any) {
      console.error(error?.errors)
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
  const increaseQuantity = (qty: number) => {
    const val = qty

    if (Number.isInteger(val) && val >= 0) {
      setQuantity(val)
      updateQuantity(val)
    }
  }
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

  return (
    <>
      <li
        className={cn('cart-list flex align-v-center flex-row mb-2', {
          'opacity-75 pointer-events-none': removing,
        })}
      >
        <div className="cart-list-image">
          <Image
            src={item.image_url}
            width={130}
            height={130}
            alt="Product Image"
            // The cart item image is already optimized and very small in size
            unoptimized
          />
        </div>
        <div className="cart-list-content">
          {/** TODO: Replace this. No `path` found at Cart */}
          <Link href={`/product/${item.url.split('/')[3]}`}>
            <span className="cart-list-name">{item.name.split('|')[0]}</span>
          </Link>
          {item.name.split('|').length >= 1 ? (
            <>
              <span className="cart-list-category-name">
                {item.name.split('|')[1]}
              </span>
            </>
          ) : (
            <span className="cart-list-name">{item.name}</span>
          )}
          {/* {item.options && item.options.length > 0 ? (
          <div className="">
            {item.options.map((option: ItemOption, i: number) => (
              <>
                <span>{option?.name}:</span>
                <span
                  key={`${item.id}-${option.name}`}
                  className="text-sm font-semibold text-accents-7"
                >
                  {option.value}
                </span>
                <br />
              </>
            ))}
          </div>
        ) : null} */}
        </div>
        <div className="cart-list-qty">
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
        <div className="cart-list-total flex flex-direction">
          <span className="item-label">Total</span>
          <span className="item-price">{price}</span>
        </div>
        <div className="flex flex-col justify-between space-y-2 text-base">
          <button className="btn btn-shadow" onClick={handleRemove}>
            Delete
          </button>
        </div>
      </li>
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

export default CartPreview
