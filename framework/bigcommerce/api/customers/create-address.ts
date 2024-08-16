import createApiHandler, {
    BigcommerceApiHandler,
    BigcommerceHandler,
} from '../utils/create-api-handler'
import isAllowedMethod from '../utils/is-allowed-method'
import { BigcommerceApiError } from '../utils/errors'
import createAddress from './handlers/create-address'



export type CreateAddressBody = {
    first_name: string,
    last_name: string,
    phone: string,
    addr1: string,
    addr2: string,
    city: string,
    country_code: string,
    state: string,
    zip: string,
    customer_id: string
}

export type CreateAddressHandlers = {
    createAddress: BigcommerceHandler<null, Partial<CreateAddressBody>>
}

const METHODS = ['POST']

const createAddressApi: BigcommerceApiHandler<null, CreateAddressHandlers> = async (
    req,
    res,
    config,
    handlers
) => {

    if (!isAllowedMethod(req, res, METHODS)) return
    try {
        const body = { ...req.body }
        return await handlers['createAddress']({ req, res, config, body })
    } catch (error) {
        console.error(error)

        const message =
            error instanceof BigcommerceApiError
                ? 'An unexpected error ocurred with the Bigcommerce API'
                : 'An unexpected error ocurred'

        res.status(500).json({ data: null, errors: [{ message }] })
    }
}

const handlers = { createAddress }

export default createApiHandler(createAddressApi, handlers, {})
