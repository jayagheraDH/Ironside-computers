import $ from 'jquery'
import usePrice from '@commerce/use-price'
import SliderCard from '@components/ui/SliderCard'
import React, { useEffect, useState } from 'react'

const ProductCard = (props: any) => {
  const data = props?.ProductCard?.value?.data
  const [currency, setCurrency] = useState<any>({})
  useEffect(() => {
    const currencyData: any = localStorage.getItem('currency_data')
    if (currencyData) setCurrency(JSON.parse(currencyData))
    $(document).on('CURRENCY_UPDATE', () => {
      const currencyData: any = localStorage.getItem('currency_data')
      setCurrency(JSON.parse(currencyData))
    })
  }, [])
  const convertCurrency = (price: any) => {
    const { price: total } = usePrice({
      amount: parseInt(price),
      currencyCode: currency?.currency_code ? currency?.currency_code : 'USD',
      currencyExchange: currency?.currency_exchange_rate
        ? parseFloat(currency?.currency_exchange_rate)
        : 1,
    })
    return total
  }

  return (
    <div className="master-works">
      <ul className="productGrid list-none flex flex-wrap">
        {data?.productCard?.map((card: any, index: any) => (
          <SliderCard
            key={index}
            index={`card-${index}`}
            backgroundImage={card?.bgImage}
            title={card?.name}
            description={card?.description}
            price={card?.price}
            link={card?.link}
            imgSrc={card?.productImage}
            titleColor={card?.titleColor}
            badgeName={card?.badgeName}
            colorPicker={card?.colorPicker}
            videoUrl={card?.videoUrl}
            convertCurrency={convertCurrency}
          />
        ))}
      </ul>
      <p className="retired-title pt90 font-Arimo font-bold uppercase text-center">
        {data?.retired}
      </p>
      <p className="mb-0 text-center mb94">{data?.retiredDescription}</p>
      <ul className="productGrid list-none flex flex-wrap mt100">
        {data?.retiredCard?.map((card: any, index: any) => (
          <SliderCard
            key={index}
            index={`retired-${index}`}
            backgroundImage={card?.bgImage}
            title={card?.name}
            description={card?.description}
            price={card?.price}
            link={card?.link}
            imgSrc={card?.productImage}
            titleColor={card?.titleColor}
            videoUrl={card?.videoUrl}
            convertCurrency={convertCurrency}
          />
        ))}
      </ul>
    </div>
  )
}

export default ProductCard
