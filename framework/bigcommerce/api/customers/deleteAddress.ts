import createApiHandler, {
    BigcommerceApiHandler,
    BigcommerceHandler,
  } from '../utils/create-api-handler'
  import isAllowedMethod from '../utils/is-allowed-method'
  import { BigcommerceApiError } from '../utils/errors'
  import deleteAddress from './handlers/delete-address'
  
  export type DeleteAddressHandlers = {
    deleteAddress: BigcommerceHandler<null, { entityId?: number }>
  }
  
  const METHODS = ['POST']
  
  const deleteAddressApi: BigcommerceApiHandler<null, DeleteAddressHandlers> = async (
    req,
    res,
    config,
    handlers
  ) => {
    if (!isAllowedMethod(req, res, METHODS)) return
  
    try {
      const body = { ...req.body }
      return await handlers['deleteAddress']({ req, res, config, body })
    } catch (error) {
      console.error(error)
  
      const message =
        error instanceof BigcommerceApiError
          ? 'An unexpected error ocurred with the Bigcommerce API'
          : 'An unexpected error ocurred'
  
      res.status(500).json({ data: null, errors: [{ message }] })
    }
  }
  
  const handlers = { deleteAddress }
  
  export default createApiHandler(deleteAddressApi, handlers, {})
  