import isAllowedMethod from './utils/is-allowed-method'
import createApiHandler, {
  BigcommerceApiHandler,
} from './utils/create-api-handler'
import { BigcommerceApiError } from './utils/errors'
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken'
import getCustomerId from './operations/get-customer-id';

const METHODS = ['GET']
const fullCheckout = true

const checkoutApi: BigcommerceApiHandler<any> = async (req, res, config) => {
  if (!isAllowedMethod(req, res, METHODS)) return

  const { cookies } = req
  const cartId = cookies[config.cartCookie]
  const customerId = (await getCustomerId({ customerToken: cookies['cust_tk'], config }))

  try {
    if (!cartId) {
      res.redirect('/cart')
      return
    }
    // @ts-ignore next-line
    const { data } = await config.storeApiFetch(
      `/v3/carts/${cartId}/redirect_urls`,
      {
        method: 'POST',
      }
    )
    if (!customerId) {
      res.redirect(data.checkout_url)
      return
    }

    const dateCreated = Math.round(new Date().getTime() / 1000)
    const payload = {
      iss: config.storeApiClientId,
      iat: dateCreated,
      jti: uuid(),
      operation: 'customer_login',
      store_hash: process.env.BIGCOMMERCE_STORE_HASH,
      customer_id: Number(customerId),
      channel_id: 1,
      redirect_to: data.checkout_url,
    }
    let token = jwt.sign(payload, process.env.BIGCOMMERCE_STORE_API_CLIENT_SECRET!, {
      algorithm: 'HS256',
    })

    let checkouturl = `https://ironside-computers-sandbox-1.mybigcommerce.com/login/token/${token}`

    if (fullCheckout) {
      res.redirect(checkouturl)
      return
    }

    // TODO: make the embedded checkout work too!
    const html = `
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Checkout</title>
          <script src="https://checkout-sdk.bigcommerce.com/v1/loader.js"></script>
          <script>
            window.onload = function() {
              checkoutKitLoader.load('checkout-sdk').then(function (service) {
                service.embedCheckout({
                  containerId: 'checkout',
                  url: '${data.embedded_checkout_url}'
                });
              });
            }
          </script>
        </head>
        <body>
          <div id="checkout"></div>
        </body>
      </html>
    `

    res.status(200)
    res.setHeader('Content-Type', 'text/html')
    res.write(html)
    res.end()
  } catch (error) {
    console.error(error)

    const message =
      error instanceof BigcommerceApiError
        ? 'An unexpected error ocurred with the Bigcommerce API'
        : 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

export default createApiHandler(checkoutApi, {}, {})
