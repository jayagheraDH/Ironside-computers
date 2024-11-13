declare let window: any
export const trackViewItemList = (products: Array<any>): void => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        const items = products.map((product) => ({
            item_name: product?.name,
            item_id: product?.sizes?.[0]?.productId || product?.productId,
            item_category: product?.categories?.edges?.[0]?.node?.name || 'Unknown Category',
            price: product?.prices?.price?.value || 0,
        }));
        window.gtag('event', 'view_item_list', {
            items,
        });
    } else {
        console.warn('Google Analytics gtag function not found.');
    }
};