import { UpdateAddressHandlers } from '../setCustomerAttribute'

const setCustomerAttribute: UpdateAddressHandlers['setCustomerAttribute'] = async ({
    res,
    body: {
        attribute_id,
        value,
        customer_id },
    config,
}) => {

    if (!(attribute_id && value && customer_id)) {
        return res.status(400).json({
            data: null,
            errors: [{ message: 'Invalid request' }],
        })
    }

    try {
        const upsertCustomerAttribute = JSON.stringify([
            {
                attribute_id,
                value,
                customer_id
            },
        ]);

        await config.storeApiFetch('/v3/customers/attribute-values', {
            method: 'PUT',
            body: upsertCustomerAttribute
        })
        res.status(200)
    } catch (error) {
        throw error
    }

    res.status(200).json({ data: null })
}

export default setCustomerAttribute
