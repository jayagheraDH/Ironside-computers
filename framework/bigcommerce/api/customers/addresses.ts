import createApiHandler, {
  BigcommerceApiHandler,
  BigcommerceHandler,
} from '../utils/create-api-handler'
import isAllowedMethod from '../utils/is-allowed-method'
import { BigcommerceApiError } from '../utils/errors'
import customerAddresses from './handlers/addresses'

export type CustomersAddressesHandlers = {
  customerAddresses: BigcommerceHandler<null, { entityId?: number|undefined }>
}

const METHODS = ['POST']

const customersAddressesApi: BigcommerceApiHandler<null, CustomersAddressesHandlers> = async (
  req,
  res,
  config,
  handlers
) => {
  if (!isAllowedMethod(req, res, METHODS)) return

  try {
    const body = { ...req.body }
    return await handlers['customerAddresses']({ req, res, config, body })
  } catch (error) {
    console.error(error)

    const message =
      error instanceof BigcommerceApiError
        ? 'An unexpected error ocurred with the Bigcommerce API'
        : 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

const handlers = { customerAddresses }

export default createApiHandler(customersAddressesApi, handlers, {})
