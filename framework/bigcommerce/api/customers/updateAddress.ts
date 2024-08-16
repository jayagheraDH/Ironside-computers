import createApiHandler, {
    BigcommerceApiHandler,
    BigcommerceHandler,
} from '../utils/create-api-handler'
import isAllowedMethod from '../utils/is-allowed-method'
import { BigcommerceApiError } from '../utils/errors'
import updateAddress from './handlers/update-address'



export type UpdateAddressBody = {
    first_name: string,
    last_name: string,
    phone: string,
    addr1: string,
    addr2: string,
    city: string,
    country_code: string,
    state: string,
    zip: string,
    id: string
}

export type UpdateAddressHandlers = {
    updateAddress: BigcommerceHandler<null, { cartId?: string } & Partial<UpdateAddressBody>>
}

const METHODS = ['PUT']

const updateAddressApi: BigcommerceApiHandler<null, UpdateAddressHandlers> = async (
    req,
    res,
    config,
    handlers
) => {

    if (!isAllowedMethod(req, res, METHODS)) return
    try {
        const body = { ...req.body }
        return await handlers['updateAddress']({ req, res, config, body })
    } catch (error) {
        console.error(error)

        const message =
            error instanceof BigcommerceApiError
                ? 'An unexpected error ocurred with the Bigcommerce API'
                : 'An unexpected error ocurred'

        res.status(500).json({ data: null, errors: [{ message }] })
    }
}

const handlers = { updateAddress }

export default createApiHandler(updateAddressApi, handlers, {})
