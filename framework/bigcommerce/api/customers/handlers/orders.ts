import { OrdersHandlers } from '../orders'

const ordersHandler: OrdersHandlers['customerOrders'] = async ({
    res,
    body: {
        entityId },
    config,
}) => {
    try {
        if (entityId) {
            const orders: any[] = await config.storeApiFetch(`/v2/orders?customer_id=${entityId}`,
                {
                    method: 'GET',
                    headers: { "Accept": "application/json" }
                })
            if (orders?.length) {
                await Promise.all(orders.map(async (order: any) => {
                    const shippingAddress: any[] = await config.storeApiFetch(`/v2/orders/${order.id}/shipping_addresses`,
                        {
                            method: 'GET',
                            headers: { "Accept": "application/json" }
                        })
                    const products: any[] = await config.storeApiFetch(`/v2/orders/${order.id}/products`,
                        {
                            method: 'GET',
                            headers: { 'Accept': 'application/json' }
                        })
                    await Promise.all(products?.map(async (product: any) => {
                        const productImage: any = await config.storeApiFetch(`/v3/catalog/products/${product?.product_id}/images`,
                            {
                                method: 'GET',
                                headers: { 'Accept': 'application/json' }
                            })
                        product.image = productImage
                    }))
                    order.shipping_address = shippingAddress
                    order.products = products
                }))
            }

            return res.status(200).json({ data: orders })
        }
    } catch (error) {
        throw error
    }

}

export default ordersHandler
