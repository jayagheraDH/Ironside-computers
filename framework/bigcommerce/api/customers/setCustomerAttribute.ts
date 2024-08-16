import createApiHandler, {
    BigcommerceApiHandler,
    BigcommerceHandler,
} from '../utils/create-api-handler'
import isAllowedMethod from '../utils/is-allowed-method'
import { BigcommerceApiError } from '../utils/errors'
import setCustomerAttribute from './handlers/set-customer-attribute'



export type SetCustomerAttributeBody = {
    attribute_id: number,
    value: string,
    customer_id: number,
}

export type UpdateAddressHandlers = {
    setCustomerAttribute: BigcommerceHandler<null, { cartId?: string } & Partial<SetCustomerAttributeBody>>
}

const METHODS = ['PUT']

const setCustomerAttributeApi: BigcommerceApiHandler<null, UpdateAddressHandlers> = async (
    req,
    res,
    config,
    handlers
) => {

    if (!isAllowedMethod(req, res, METHODS)) return
    try {
        const body = { ...req.body }
        return await handlers['setCustomerAttribute']({ req, res, config, body })
    } catch (error) {
        console.error(error)

        const message =
            error instanceof BigcommerceApiError
                ? 'An unexpected error ocurred with the Bigcommerce API'
                : 'An unexpected error ocurred'

        res.status(500).json({ data: null, errors: [{ message }] })
    }
}

const handlers = { setCustomerAttribute }

export default createApiHandler(setCustomerAttributeApi, handlers, {})
