import createApiHandler, {
    BigcommerceApiHandler,
    BigcommerceHandler,
} from '../utils/create-api-handler'
import isAllowedMethod from '../utils/is-allowed-method'
import { BigcommerceApiError } from '../utils/errors'
import currencyConvert from './handlers/currency-convert'

export type CurrencyConvertHandlers = {
    currencyConvert: BigcommerceHandler<null>
}

const METHODS = ['GET']

const currencyConvertApi: BigcommerceApiHandler<null, CurrencyConvertHandlers> = async (
    req,
    res,
    config,
    handlers
) => {
    if (!isAllowedMethod(req, res, METHODS)) return

    try {
        return await handlers['currencyConvert']({
            req, res, config,
            body: null
        })
    } catch (error) {
        console.error(error)

        const message =
            error instanceof BigcommerceApiError
                ? 'An unexpected error ocurred with the Bigcommerce API'
                : 'An unexpected error ocurred'

        res.status(500).json({ data: null, errors: [{ message }] })
    }
}

const handlers = { currencyConvert }

export default createApiHandler(currencyConvertApi, handlers, {})
