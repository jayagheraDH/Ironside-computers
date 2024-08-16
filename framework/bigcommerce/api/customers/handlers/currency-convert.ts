import { CurrencyConvertHandlers } from '../currencyConverter'

const currencyConvertHandler: CurrencyConvertHandlers['currencyConvert'] = async ({
    res,
    config,
}) => {
    try {
        const currencies = await config.storeApiFetch(`/v2/currencies`,
            {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            })
        return res.status(200).json({ data: currencies })

    } catch (error) {
        throw error
    }

}

export default currencyConvertHandler
