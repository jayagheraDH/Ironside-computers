import React, { useEffect, useState } from 'react'
import { dateFormatter } from '@lib/date-formatter'
import CartOrderItem from '@components/cart/CartOrderView/CartOrderItems'
import useCustomerOrders from '@framework/use-customer-orders'
import VisaIcon from '@components/icons/VisaIcon'
import Shipping from '@components/icons/Shippping'
import usePrice from '@commerce/use-price'

const OrderHistory = ({ data, currency }: any) => {
  const customerOrders = useCustomerOrders()
  const [orderHistory, setOrderHistory] = useState([])
  const [orderItems, setOrderItems] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orderViewData, setOrderViewData] = useState<any>({})
  const getUsers = async () => {
    const ordersData: any = await customerOrders({
      entityId: data?.entityId,
    })
    setOrderHistory(ordersData)
  }
  useEffect(() => {
    getUsers()
  }, [])
  const openOrderDetails = (order: any) => {
    const items =
      order?.products?.filter((item: any) => {
        return item?.parent_order_product_id === null
      }) ?? []
    setOrderItems(items)
    setOrderViewData(order)
    setIsModalOpen(true)
  }
  const items =
    orderViewData?.products?.filter((item: any) => {
      return item?.parent_order_product_id === null
    }) ?? []

  const totalQuantities = items
    .map((item: any) => item.quantity)
    .reduce((acc: number, curr: number) => acc + curr, 0)

  const totalItems = (products: any) => {
    const items =
      products?.filter((item: any) => {
        return item?.parent_order_product_id === null
      }) ?? []

    const totalQuantities = items
      .map((item: any) => item.quantity)
      .reduce((acc: number, curr: number) => acc + curr, 0)

    return totalQuantities
  }
  const convertCurrency = (price: any) => {
    const { price: total } = usePrice({
      amount: parseInt(price),
      currencyCode: currency?.currency_code ? currency?.currency_code : 'USD',
      currencyExchange: currency?.currency_exchange_rate
        ? parseFloat(currency?.currency_exchange_rate)
        : 1,
    })
    return total
  }

  return (
    <div className="address-loader history-page">
      {orderHistory === null ? (
        <h4>No Order History</h4>
      ) : !orderHistory?.length ? (
        <div className="content-flex w-100">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="addresses-grid">
          <div className="order-details w-100">
            {isModalOpen ? (
              <>
                <p
                  className="uppercase learn-more-before"
                  onClick={() => setIsModalOpen(false)}
                >
                  <a>Back to all orders</a>
                </p>
                <div className="order-history history-detail">
                  <div className="order-header flex justify-space">
                    <div className="order-header-text">
                      <p>
                        Order<span>{orderViewData.id}</span>
                      </p>
                    </div>
                    <div className="flex">
                      <div className="order-header-text">
                        <p>
                          Placed
                          <span>
                            {dateFormatter(orderViewData.date_modified)}
                          </span>
                        </p>
                      </div>
                      <div className="order-header-text">
                        <p>
                          Items<span>{totalQuantities}</span>
                        </p>
                      </div>
                      <div className="order-header-text">
                        <p>
                          Total
                          <span>
                            {convertCurrency(orderViewData.total_inc_tax)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="billing-section flex flex-wrap">
                    <div className="billing-section-left flex flex-wrap justify-space">
                      <div>
                        <h2>Billing</h2>
                        <div className="flex">
                          <VisaIcon />
                          <div>
                            <span>Payment Method</span>
                            <p className="mb-0">
                              {orderViewData.payment_method}
                            </p>
                          </div>
                        </div>
                        <p>{`${orderViewData.billing_address.first_name} ${orderViewData.billing_address.last_name}
                  ${orderViewData.billing_address.street_1}
                  ${orderViewData.billing_address.street_2}
                  ${orderViewData.billing_address.city}, ${orderViewData.billing_address.country_iso2} ${orderViewData.billing_address.zip}`}</p>
                      </div>
                      <div>
                        <h2>Shipping</h2>
                        <div className="flex align-v-center">
                          <Shipping />
                          <p className="mb-0">Fedex Ground 3-Day</p>
                        </div>
                        <p>{`${orderViewData.shipping_address[0].first_name} ${orderViewData.shipping_address[0].last_name}
                  ${orderViewData.shipping_address[0].street_1}
                  ${orderViewData.shipping_address[0].street_2}
                  ${orderViewData.shipping_address[0].city}, ${orderViewData.shipping_address[0].country_iso2} ${orderViewData.shipping_address[0].zip}`}</p>
                      </div>
                    </div>
                    <div className="billing-section-right">
                      <h2>Summary</h2>
                      <div className="cart-page-right lg:col-span-4">
                        <div>
                          <div className="sub-total">
                            <ul className="sub-total-top ml-0">
                              <li className="flex justify-between">
                                <span className="cart-subtotal-label">
                                  Subtotal
                                </span>
                                <span className="cart-subtotal-value">
                                  {convertCurrency(orderViewData.total_ex_tax)}
                                </span>
                              </li>
                              <li className="flex justify-between">
                                <span className="cart-subtotal-label">
                                  Promotions
                                </span>
                                <span className="cart-subtotal-value">
                                  -
                                  {convertCurrency(
                                    orderViewData.discount_amount
                                  )}
                                </span>
                              </li>
                              <li className="flex justify-between">
                                <span className="cart-subtotal-label">
                                  Shipping
                                </span>
                                <span className="cart-subtotal-value">
                                  {convertCurrency(
                                    orderViewData.shipping_address[0]
                                      .cost_inc_tax
                                  )}
                                </span>
                              </li>
                              <li className="flex justify-between">
                                <span className="cart-subtotal-label">
                                  Taxes
                                </span>
                                <span className="cart-subtotal-value">
                                  {convertCurrency(orderViewData.total_tax)}
                                </span>
                              </li>
                            </ul>
                            <div className="sub-total-bottom flex justify-between">
                              <span className="cart-total-label">Total</span>
                              <span className="cart-total-value">
                                {convertCurrency(orderViewData.total_inc_tax)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-space">
                    <ul className="cart-listing m-0 w-100">
                      {orderItems.map((item: any) => (
                        <CartOrderItem
                          key={item.id}
                          item={item}
                          status={orderViewData?.status}
                          convertCurrency={convertCurrency}
                        />
                      ))}
                      <div className="about-spacer flex flex-wrap flex-direction-row align-v-center justify-space-end">
                        <p className="mb-0">
                          Contact us for order changes, returns, or repairs.
                        </p>
                        <div className="about-support">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="71"
                            height="71"
                            viewBox="0 0 71 71"
                            fill="none"
                          >
                            <path
                              d="M60.4313 24.9531H56.8805C53.4498 24.9531 50.6667 27.7454 50.6667 31.1875V49C50.6667 52.4421 53.4498 55.2344 56.8805 55.2344H60.4313C65.8256 55.2344 70.1958 50.8496 70.1958 45.4375V34.75C70.1958 29.3378 65.8256 24.9531 60.4313 24.9531ZM56.8805 30.2969H60.4313C62.8841 30.2969 64.8697 32.2891 64.8697 34.75V45.4375C64.8697 47.8985 62.8841 49.8906 60.4313 49.8906H56.8805C56.3913 49.8906 55.9929 49.4909 55.9929 49V31.1875C55.9929 30.6966 56.3913 30.2969 56.8805 30.2969Z"
                              fill="#3E3E3E"
                            />
                            <path
                              d="M14.2716 24.9531H10.7208C5.3265 24.9531 0.956299 29.3378 0.956299 34.75V45.4375C0.956299 50.8496 5.3265 55.2344 10.7208 55.2344H14.2716C17.7023 55.2344 20.4854 52.4421 20.4854 49V31.1875C20.4854 27.7454 17.7023 24.9531 14.2716 24.9531ZM10.7208 30.2969H14.2716C14.7608 30.2969 15.1593 30.6966 15.1593 31.1875V49C15.1593 49.4909 14.7608 49.8906 14.2716 49.8906H10.7208C8.26802 49.8906 6.28241 47.8985 6.28241 45.4375V34.75C6.28241 32.2891 8.26802 30.2969 10.7208 30.2969Z"
                              fill="#3E3E3E"
                            />
                            <path
                              d="M35.5761 0.015625C49.5096 0.015625 60.8571 11.1208 61.3052 24.9912L61.319 25.8438V27.625C61.319 29.1006 60.1267 30.2969 58.656 30.2969C57.3077 30.2969 56.1935 29.2917 56.0171 27.9876L55.9929 27.625V25.8438C55.9929 14.53 46.8526 5.35938 35.5761 5.35938C24.562 5.35938 15.5857 14.1084 15.1741 25.058L15.1594 25.8438V27.625C15.1594 29.1006 13.9671 30.2969 12.4963 30.2969C11.1481 30.2969 10.0339 29.2917 9.85757 27.9876L9.83325 27.625V25.8438C9.83325 11.5788 21.3582 0.015625 35.5761 0.015625Z"
                              fill="#3E3E3E"
                            />
                            <path
                              d="M37.7953 56.125H33.3569C29.4361 56.125 26.2554 59.3163 26.2554 63.25L26.2817 63.8399C26.6588 67.5962 29.7058 70.375 33.3569 70.375H37.7953C41.716 70.375 44.8968 67.1837 44.8968 63.25L44.8705 62.6601C44.4934 58.9038 41.4465 56.125 37.7953 56.125ZM33.3569 61.4688H37.7953C38.7065 61.4688 39.4702 62.1652 39.5614 63.0651L39.5742 63.385C39.5707 64.2325 38.7745 65.0312 37.7953 65.0312H33.3569C32.4457 65.0312 31.6819 64.3348 31.5908 63.4349L31.5781 63.115C31.5815 62.2675 32.3776 61.4688 33.3569 61.4688Z"
                              fill="#3E3E3E"
                            />
                            <path
                              d="M56.8804 49.8906C58.2286 49.8906 59.3429 50.896 59.5193 52.1998L59.5435 52.5625V56.125C59.5435 61.3366 55.491 65.5956 50.374 65.9041L49.7789 65.9219H42.2336C40.7629 65.9219 39.5706 64.7256 39.5706 63.25C39.5706 61.8973 40.5726 60.7794 41.8721 60.6023L42.2336 60.5781H49.7789C52.0784 60.5781 53.9674 58.8272 54.1946 56.5806L54.2174 56.125V52.5625C54.2174 51.0869 55.4097 49.8906 56.8804 49.8906Z"
                              fill="#3E3E3E"
                            />
                          </svg>
                          <div className="support-content">
                            <a className="call" href="tel:1 (512) 696-1455">
                              1 (512) 696-1455
                            </a>
                            <a href="mailto:help@ironsidecomputers.com">
                              help@ironsidecomputers.com
                            </a>
                            <p>Mon – Fri 9am to 4:30pm CST</p>
                          </div>
                        </div>
                      </div>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <ul className="list-none">
                {!!orderHistory?.length &&
                  orderHistory?.map((order: any, index: number) => (
                    <li key={index}>
                      <div className="order-details-list flex justify-space align-v-center">
                        <div className="cart-item-detail-image">
                          <img
                            src={
                              order?.products[0]?.image.data[0]?.url_standard
                            }
                            width={150}
                            height={150}
                            alt="Product Image"
                          />
                        </div>
                        <div className="order-details-grid">
                          <div>
                            <p>Order</p>
                            <h2>{order.id}</h2>
                          </div>
                          <div>
                            <p>Placed</p>
                            <h2>{dateFormatter(order.date_modified)}</h2>
                          </div>
                          <div>
                            <p>Items</p>
                            <h2>{totalItems(order.products)}</h2>
                          </div>
                          <div>
                            <p>Total</p>
                            <h2>
                              {convertCurrency(order.total_inc_tax)}
                            </h2>
                          </div>
                          <button
                            onClick={() => {
                              openOrderDetails(order)
                            }}
                            className="btn details-btn uppercase"
                          >
                            order details
                          </button>
                        </div>
                        <div
                          className={
                            order?.status.replaceAll(' ', '-').toLowerCase() +
                            ' order-status flex align-v-center justify-space'
                          }
                        >
                          <div>
                            <p className="mb-0">Status</p>
                            <h2>{order?.status}</h2>
                            <span className="item-eta">ETA 6/2/23</span>
                          </div>
                          <button className="btn">Info</button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderHistory
