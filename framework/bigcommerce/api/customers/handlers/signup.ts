import { BigcommerceApiError } from '../../utils/errors'
import login from '../../operations/login'
import { SignupHandlers } from '../signup'

const signup: SignupHandlers['signup'] = async ({
  res,
  body: {
    firstName,
    lastName,
    email,
    password,
    company,
    address1,
    address2,
    city,
    state_or_province,
    postal_code,
    country_code },
  config,
}) => {
  // TODO: Add proper validations with something like Ajv
  if (!(firstName && lastName && email && password && address1 && city && country_code)) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }
  // TODO: validate the password and email
  // Passwords must be at least 7 characters and contain both alphabetic
  // and numeric characters.

  try {
    const reqBody = JSON.stringify([
      {
        first_name: firstName,
        last_name: lastName,
        company,
        email,
        addresses: [
          {
            first_name: firstName,
            last_name: lastName,
            address1,
            address2,
            city,
            state_or_province,
            postal_code,
            country_code
          }
        ],
        authentication: {
          new_password: password,
        },
      },
    ]);

    await config.storeApiFetch('/v3/customers', {
      method: 'POST',
      body: reqBody
    })
  } catch (error: any) {
    if (error instanceof BigcommerceApiError && error.status === 422) {
      return res.status(400).json({
        data: null,
        errors: [
          {
            message: `${Object.values(error.data.errors)[0]}`,
            code: `${error.data.title}`,
          },
        ],
      })
    }

    throw error
  }

  // Login the customer right after creating it
  await login({ variables: { email, password }, res, config })

  res.status(200).json({ data: null })
}

export default signup
