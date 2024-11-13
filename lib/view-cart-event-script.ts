declare let window: any

export const trackViewCart = (products: Array<any>): void => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        const items = products.map((product) => ({
            item_name: product?.name,
            item_id: product?.variant_id,
            // item_category: product?.categories?.edges?.[0]?.node?.name || 'Unknown Category',
            quantity: product?.quantity,
            price: product?.sale_price || 0,
        }));
        window.gtag('event', 'view_cart', {
            items,
        });
    } else {
        console.warn('Google Analytics gtag function not found.');
    }
};