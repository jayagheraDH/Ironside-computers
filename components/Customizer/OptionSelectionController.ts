import { useState } from 'react'

const OptionSelectionController = ({ product, categoriesDataFiltered }: any) => {
    const [selectedIds, setSelectedIds] = useState<any>([])
    const [selectedColor, setSelectedColor] = useState<any>([])
    const [select, setSelect] = useState<boolean>(false);
    const [optionSelections, setOptionSelections] = useState<any>([])
    const [modalImage, setModalImage] = useState<any>([])

    const onOptionSelections = (
        productId: number,
        category: string,
        price: any,
        colorOpts?: any
    ) => {
        product?.productOptions?.edges?.forEach((data: any) => {
            if (data?.node.displayName == category) {
                data?.node?.values?.edges.forEach((product: any) => {
                    if (product?.node.productId === productId) {
                        const productData = {
                            option_id: data?.node?.entityId,
                            option_value: product?.node.entityId,
                            product_id: productId,
                            category_name: data?.node.displayName,
                            product_name: product?.node.label,
                            productPrice: price,
                        }
                        if (category.toLocaleLowerCase() == 'case') {
                            caseImageChange(productData?.product_id, colorOpts)
                        }
                        const colorArr = [...selectedColor]
                        colorArr?.forEach((ele: any) => {
                            if (category === ele?.category_name && !colorOpts) {
                                setSelectedColor([])
                            }
                        })
                        setSelectedIds((prev: any) => {
                            const catExist = prev?.findIndex(
                                (obj: any) => obj?.cat === productData?.category_name
                            )
                            if (catExist >= 0) {
                                prev[catExist] = {
                                    cat: data?.node.displayName,
                                    product: productId,
                                    productPrice: price,
                                }
                            }
                            if (catExist < 0) {
                                return [
                                    ...prev,
                                    {
                                        cat: data?.node.displayName,
                                        product: productId,
                                        productPrice: price,
                                    },
                                ]
                            }
                            return prev
                        })
                        setSelect(!select);
                        setOptionSelections((prevItems: any) => {
                            const isItemExists = prevItems?.some(
                                (item: any) => item.option_id === productData.option_id
                            )
                            const indexOfObject = prevItems?.findIndex(
                                (obj: any) => obj.option_id === productData.option_id
                            )
                            if (isItemExists && indexOfObject !== -1) {
                                prevItems[indexOfObject] = productData
                            }

                            if (!isItemExists) {
                                return [...prevItems, productData]
                            }
                            return prevItems
                        })
                    }
                    if (colorOpts) {
                        if (product.node.productId === colorOpts.entityId) {
                            const colorOptionData: any = [{
                                option_id: data?.node?.entityId,
                                option_value: product.node.entityId,
                                product_id: colorOpts?.entityId,
                                category_name: data?.node.displayName,
                                product_name: product.node.label,
                                productPrice: price,
                                parent_id: productId,
                                product_image: colorOpts?.images?.edges[0]?.node?.urlOriginal
                            }]
                            setSelectedColor((prev: any) => {
                                const catExist = prev?.findIndex(
                                    (obj: any) => obj?.category_name === data?.node.displayName
                                )
                                if (catExist >= 0) {
                                    prev[catExist] = {
                                        option_id: data?.node?.entityId,
                                        option_value: product.node.entityId,
                                        product_id: colorOpts?.entityId,
                                        category_name: data?.node.displayName,
                                        product_name: product.node.label,
                                        productPrice: price,
                                        parent_id: productId,
                                        product_image: colorOpts?.images?.edges[0]?.node?.urlOriginal
                                    }
                                }
                                if (catExist < 0) {
                                    return [
                                        ...prev,
                                        colorOptionData[0],
                                    ]
                                }
                                return prev
                            })

                            setSelectedIds((prev: any) => {
                                const catExist = prev?.findIndex(
                                    (obj: any) => obj.cat === `${data?.node.displayName} Color`
                                )
                                if (catExist >= 0) {
                                    prev[catExist] = {
                                        cat: `${data?.node.displayName} Color`,
                                        product: colorOpts?.entityId,
                                        productPrice: 0
                                    }
                                }
                                if (catExist < 0) {
                                    return [
                                        ...prev,
                                        {
                                            cat: `${data?.node.displayName} Color`,
                                            product: colorOpts?.entityId,
                                            productPrice: 0
                                        },
                                    ]
                                }
                                return prev
                            })
                        }
                    }
                })
            }
        })
    }
    const caseImageChange = (
        product_id: number,
        colorOpts: any
    ) => {
        categoriesDataFiltered?.forEach((cat: any) => {
            if (cat?.categoryName.toLowerCase() === 'aesthetics') {
                cat?.subCategory?.forEach((data: any) => {
                    if (data?.categoryName.toLowerCase() === 'case') {
                        data?.products?.forEach((product: any) => {
                            if (product_id === product?.entityId) {
                                if (colorOpts) {
                                    setModalImage(colorOpts?.images?.edges)
                                } else {
                                    setModalImage(product?.images?.edges)
                                }
                            }
                        })
                    }
                })
            }
        })
    }
    const warranties = (selectedWarranty: any) => {
        let warranty = ''
        categoriesDataFiltered?.forEach((cat: any) => {
            if (cat?.categoryName === "Services") {
                cat?.subCategory?.forEach((subs: any) => {
                    if (subs?.categoryName === "Warranty") {
                        subs?.products?.forEach((prod: any) => {
                            if (prod?.name === selectedWarranty) {
                                warranty = prod?.images.edges[0].node.altText;
                            }
                        })
                    }
                })
            }
        })
        return warranty
    }

    return {
        selectedIds,
        selectedColor,
        select,
        optionSelections,
        modalImage,
        onOptionSelections,
        warranties
    }
}

export { OptionSelectionController }