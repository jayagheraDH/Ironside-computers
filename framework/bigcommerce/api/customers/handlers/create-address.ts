import { CreateAddressHandlers } from '../create-address'

const createAddress: CreateAddressHandlers['createAddress'] = async ({
    res,
    body: {
        first_name,
        last_name,
        phone,
        addr1,
        addr2,
        city,
        country_code,
        state,
        zip,
        customer_id },
    config,
}) => {

    if (!(first_name && last_name && addr1 && city && zip && country_code && customer_id)) {
        return res.status(400).json({
            data: null,
            errors: [{ message: 'Invalid request' }],
        })
    }

    try {
        const createAddress = JSON.stringify([
            {
                first_name,
                last_name,
                phone,
                address1: addr1,
                address2: addr2,
                city,
                country_code,
                state_or_province: state,
                postal_code: zip,
                customer_id
            },
        ]);

        await config.storeApiFetch('/v3/customers/addresses', {
            method: 'POST',
            body: createAddress
        })
        res.status(200)
    } catch (error) {
        throw error
    }

    res.status(200).json({ data: null })
}

export default createAddress
