import { ReactNode } from 'react'
import * as React from 'react'
import {
  CommerceConfig,
  CommerceProvider as CoreCommerceProvider,
  useCommerce as useCoreCommerce,
} from '@commerce'
import { FetcherError } from '@commerce/utils/errors'
import $ from 'jquery'

async function getText(res: Response) {
  try {
    return (await res.text()) || res.statusText
  } catch (error) {
    return res.statusText
  }
}

async function getError(res: Response) {
  if (res.headers.get('Content-Type')?.includes('application/json')) {
    const data = await res.json()
    const err: any = new FetcherError({
      errors: data.errors,
      status: res.status,
    })
    if (err.errors[0].code === 'stock_out') {
      localStorage.setItem('cartErr', err.errors[0].message)
      $(document).trigger('CART_ERROR')
      return
    }else{
      return new FetcherError({ errors: data.errors, status: res.status })
    }
  }
  return new FetcherError({ message: await getText(res), status: res.status })
}

export const bigcommerceConfig: CommerceConfig = {
  locale: 'en-us',
  cartCookie: 'bc_cartId',
  async fetcher({ url, method = 'GET', variables, body: bodyObj }) {
    const hasBody = Boolean(variables || bodyObj)
    const body = hasBody
      ? JSON.stringify(variables ? { variables } : bodyObj)
      : undefined
    const headers = hasBody ? { 'Content-Type': 'application/json' } : undefined
    const res = await fetch(url!, { method, body, headers })

    if (res.ok) {
      const { data } = await res.json()
      return data
    }

    throw await getError(res)
  },
}

export type BigcommerceConfig = Partial<CommerceConfig>

export type BigcommerceProps = {
  children?: ReactNode
  locale: string
} & BigcommerceConfig

export function CommerceProvider({ children, ...config }: BigcommerceProps) {
  return (
    <CoreCommerceProvider config={{ ...bigcommerceConfig, ...config }}>
      {children}
    </CoreCommerceProvider>
  )
}

export const useCommerce = () => useCoreCommerce()
