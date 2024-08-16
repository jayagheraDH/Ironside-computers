import { useMemo } from 'react'
import { useCommerce } from '.'

export function formatPrice({
  amount,
  currencyCode,
  currencyExchange,
  locale,
}: {
  amount: number
  currencyCode: string
  currencyExchange?: number
  locale: string
}) {
  const formatCurrency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  })
  let price = amount
  if (currencyExchange) return formatCurrency.format(price * currencyExchange)
  else return formatCurrency.format(price)
}

export function formatVariantPrice({
  amount,
  baseAmount,
  currencyCode,
  currencyExchange,
  locale,
}: {
  baseAmount: number
  amount: number
  currencyCode: string
  currencyExchange?: number
  locale: string
}) {
  const hasDiscount = baseAmount > amount
  const formatDiscount = new Intl.NumberFormat(locale, { style: 'percent' })
  const discount = hasDiscount
    ? formatDiscount.format((baseAmount - amount) / baseAmount)
    : null

  const price = formatPrice({ amount, currencyCode, currencyExchange, locale })
  const basePrice = hasDiscount
    ? formatPrice({
        amount: baseAmount,
        currencyCode,
        currencyExchange,
        locale,
      })
    : null

  return { price, basePrice, discount }
}

export default function usePrice(
  data?: {
    amount: number
    baseAmount?: number
    currencyCode: string
    currencyExchange?: number
  } | null
) {
  const { amount, baseAmount, currencyCode, currencyExchange } = data ?? {}
  const { locale } = useCommerce()
  let value:any = ''

  if (typeof amount === 'number' && currencyCode) {
    if (baseAmount) {
      value = formatVariantPrice({
        amount,
        baseAmount,
        currencyCode,
        currencyExchange,
        locale,
      })
    } else {
      value = formatPrice({
        amount,
        currencyCode,
        currencyExchange,
        locale,
      })
    }
  }

  return typeof value === 'string' ? { price: value } : value
}
