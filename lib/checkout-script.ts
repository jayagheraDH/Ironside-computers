declare let window: any

export const trackCheckout = (currency: any, cartValue: any, products: Array<any>): void => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        const items = products.map((product) => ({
            item_name: product?.name,
            item_id: product?.variant_id,
            quantity: product?.quantity,
            price: product?.sale_price || 0,
        }));
        window.gtag('event', 'begin_checkout', {
            'currency': currency?.currency_code,
            'value': cartValue,
            items,
        });
    } else {
        console.warn('Google Analytics gtag function not found.');
    }
};