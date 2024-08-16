import createApiHandler, {
    BigcommerceApiHandler,
    BigcommerceHandler,
  } from '../utils/create-api-handler'
  import isAllowedMethod from '../utils/is-allowed-method'
  import { BigcommerceApiError } from '../utils/errors'
  import customerOrders from './handlers/orders'
  
  export type OrdersHandlers = {
    customerOrders: BigcommerceHandler<null, { entityId?: number|undefined }>
  }
  
  const METHODS = ['POST']
  
  const customerOrdersApi: BigcommerceApiHandler<null, OrdersHandlers> = async (
    req,
    res,
    config,
    handlers
  ) => {
    if (!isAllowedMethod(req, res, METHODS)) return
  
    try {
      const body = { ...req.body }
      return await handlers['customerOrders']({ req, res, config, body })
    } catch (error) {
      console.error(error)
  
      const message =
        error instanceof BigcommerceApiError
          ? 'An unexpected error ocurred with the Bigcommerce API'
          : 'An unexpected error ocurred'
  
      res.status(500).json({ data: null, errors: [{ message }] })
    }
  }
  
  const handlers = { customerOrders }
  
  export default createApiHandler(customerOrdersApi, handlers, {})
  