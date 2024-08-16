import { DeleteAddressHandlers } from '../deleteAddress'

const deleteAddress: DeleteAddressHandlers['deleteAddress'] = async ({
  res,
  body: {
    entityId },
  config,
}) => {
  try {
    const addresses = await config.storeApiFetch(`/v3/customers/addresses${entityId ? `?id:in=${entityId.toString()}` : ''}`,
      {
        method: 'DELETE'
      })

    return res.status(200).json({ data: addresses })
  } catch (error) {
    throw error
  }

}

export default deleteAddress
