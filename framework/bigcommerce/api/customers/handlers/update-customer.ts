import { BigcommerceApiError } from '../../utils/errors'
import { UpdateCustomerHandlers } from '../updateCustomer'

const updateCustomer: UpdateCustomerHandlers['updateCustomer'] = async ({
    res,
    body: {
        firstName,
        lastName,
        email,
        phone,
        newPassword,
        entityId },
    config,
}) => {
    
    if (!(firstName && lastName && email)) {
        return res.status(400).json({
            data: null,
            errors: [{ message: 'Invalid request' }],
        })
    }

    try {
        const updateProfile = JSON.stringify([
            {
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                id: entityId
            },
        ]);

        const updatePassword = JSON.stringify([
            {
                id: entityId,
                authentication: {
                    force_password_reset: false,
                    new_password: newPassword
                },
            },
        ]);

        await config.storeApiFetch('/v3/customers', {
            method: 'PUT',
            body: newPassword?.length ? updatePassword : updateProfile
        })
    } catch (error) {
        if (error instanceof BigcommerceApiError && error.status === 422) {
            const hasEmailError = '0.email' in error.data?.errors

            if (hasEmailError) {
                return res.status(400).json({
                    data: null,
                    errors: [
                        {
                            message: 'The email is already in use',
                            code: 'duplicated_email',
                        },
                    ],
                })
            }
        }

        throw error
    }

    res.status(200).json({ data: null })
}

export default updateCustomer
