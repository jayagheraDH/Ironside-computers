import { CustomersAddressesHandlers } from '../addresses'

const addressesHandler: CustomersAddressesHandlers['customerAddresses'] = async ({
  res,
  body: {
    entityId },
  config,
}) => {
  try {
    if (entityId) {

      const addresses = await config.storeApiFetch(`/v3/customers/addresses?customer_id:in=${entityId?.toString()}`,
        {
          method: 'GET'
        })

      return res.status(200).json({ data: addresses })
    }
  } catch (error) {
    throw error
  }

}

export default addressesHandler
