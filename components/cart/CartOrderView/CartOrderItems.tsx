type ItemOption = {
  display_value_customer: string
  display_name: string
  nameId: number
  value: string
  valueId: number
}

const CartOrderItem = ({
  item,
  status,
  convertCurrency,
}: {
  item: any
  status: string
  convertCurrency: any
}) => {
  return (
    <li
      className={
        'cart-listing-item flex flex-direction flex-row pt-2 pl-10 pb-2 pr-10 mb-5'
      }
    >
      <div className="cart-item-detail flex flex-wrap align-v-center justify-space">
        <div className="cart-item-left flex align-v-center">
          <div className="cart-item-detail-image">
            <img
              src={item?.image.data[0]?.url_thumbnail}
              width={150}
              height={150}
              alt="Product Image"
            />
          </div>
          <div className="cart-item-detail-heading flex align-v-center">
            {item?.name?.split('|').length > 1 ? (
              <div>
                Products
                <span className="cart-list-name">
                  {item.name.split('|')[0]}
                </span>
                <span className="cart-list-category-name">
                  {item.name.split('|')[1]}
                </span>
              </div>
            ) : (
              <>
                <span className="item-label">Product</span>
                <span className="cart-list-name">{item.name}</span>
              </>)}
            <div className="ml-auto flex flex-col text-base">
              <span className="item-label">Total</span>
              <span className="item-price">
                {convertCurrency(item?.total_inc_tax)}
              </span>
            </div>
          </div>
        </div>
        <div className="cart-item-right flex align-v-center">
          <div className="status-box flex align-v-center justify-center flex-direction-row flex-col text-base">
            <div className={status}>
              <span className="item-label">Status</span>
              <span className="item-price">{status}</span>
              <br />
              <span className="item-eta">ETA 6/2/23</span>
            </div>
            <button className="btn">Track</button>
          </div>
        </div>
      </div>
      {item.product_options && item.product_options.length > 0 ? (
        <div className="cart-options mt-2 pt-10 mb-5">
          <p className="cart-option-details"> Details </p>
          <ul className="m-0">
            {item?.product_options?.map((option: ItemOption, i: number) => (
              <li key={i} className="text-sm font-semibold text-accents-7">
                <p className="options-details mb-0">
                  <span>{option.display_name}</span>{' '}
                  {option.display_value_customer}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  )
}

export default CartOrderItem
