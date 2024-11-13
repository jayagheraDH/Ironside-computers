declare let window: any

export const sendViewItemEvent = (product: any) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'view_item', {
            currency: product?.prices?.price?.currencyCode,
            items: [
                {
                    item_name: product?.name,
                    item_id: product?.entityId,
                    item_category: product?.categories?.edges[0]?.node?.name,
                    price: product?.prices?.price?.value || 0,
                },
            ],
        });
    } else {
        console.warn('Google Analytics gtag function not found.');
    }
};