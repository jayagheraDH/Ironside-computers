declare let window: any
export const trackAddToCart = (
    currency: string,
    productName: string,
    productId: string,
    category: string,
    price: number
): void => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'add_to_cart', {
            currency: currency,
            value: price,
            items: [
                {
                    item_name: productName,
                    item_id: productId.toString(),
                    item_category: category,
                    price: price,
                },
            ],
        });
    } else {
        console.warn('Google Analytics gtag function not found.');
    }
};