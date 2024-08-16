import createApiHandler, {
    BigcommerceApiHandler,
    BigcommerceHandler,
} from '../utils/create-api-handler'
import isAllowedMethod from '../utils/is-allowed-method'
import { BigcommerceApiError } from '../utils/errors'
import updateCustomer from './handlers/update-customer'



export type UpdateCustomerBody = {
    firstName: string
    lastName: string
    email: string
    phone: string
    entityId: number
    newPassword: string
}

export type UpdateCustomerHandlers = {
    updateCustomer: BigcommerceHandler<null, { cartId?: string } & Partial<UpdateCustomerBody>>
}

const METHODS = ['PUT']

const updateCustomerApi: BigcommerceApiHandler<null, UpdateCustomerHandlers> = async (
    req,
    res,
    config,
    handlers
) => {

    if (!isAllowedMethod(req, res, METHODS)) return
    try {
        const body = { ...req.body }
        return await handlers['updateCustomer']({ req, res, config, body })
    } catch (error) {
        console.error(error)

        const message =
            error instanceof BigcommerceApiError
                ? 'An unexpected error ocurred with the Bigcommerce API'
                : 'An unexpected error ocurred'

        res.status(500).json({ data: null, errors: [{ message }] })
    }
}

const handlers = { updateCustomer }

export default createApiHandler(updateCustomerApi, handlers, {})
