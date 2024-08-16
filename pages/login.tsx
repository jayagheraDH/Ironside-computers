import type { InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { setCookie } from 'cookies-next'
import { useEffect, useState, useCallback } from 'react'
import { validate } from 'email-validator'
import { BuilderComponent, builder } from '@builder.io/react'
import useLogin from '@framework/use-login'
import useCart from '@framework/cart/use-cart'
import useCustomer from '@framework/use-customer'
import useSetCustomerAttribute from '@framework/use-set-customer-attribute'
import { Layout } from '@components/common'
import { Button, Input } from '@components/ui'
import { useUI } from '@components/ui/context'
import Header from '@components/BuilderHeader/Header'
import WrongPassword from '@components/icons/WrongPassword'

export async function getStaticProps() {
  const header = await builder.get('header').toPromise()

  return {
    props: { header },
    revalidate: 14400,
  }
}

export default function Login({
  header,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const { closeModal } = useUI()
  const router = useRouter()
  const login = useLogin()
  const setCustomerAttribute = useSetCustomerAttribute()
  const { data } = useCart()

  const { data: customer }: any = useCustomer()

  if (typeof window !== 'undefined') {
    document.querySelector('#body')?.setAttribute('data-theme', 'dark')
    document.querySelector('html')?.removeAttribute('data-theme')
  }

  const handleLogin = async (e: React.SyntheticEvent<EventTarget>) => {
    setEmailError(false)
    setPasswordError(false)
    e.preventDefault()
    if (!email.length && !password.length) {
      setEmailError(true)
      setPasswordError(true)
      return
    }
    if (!email.length || !validate(email)) {
      setEmailError(true)
      return
    }
    if (!password.length) {
      setPasswordError(true)
      return
    }

    if (!dirty && !disabled) {
      setDirty(true)
      handleValidation()
    }

    try {
      setLoading(true)
      setMessage('')
      await login({
        email,
        password,
      })
      closeModal()
    } catch (errors: any) {
      // @ts-ignore next-line
      setMessage(errors.errors[0]?.message)
      setLoading(false)
    }
  }

  const setCartId = async () => {
    if (data?.id) {
      await setCustomerAttribute({
        attribute_id: 1,
        value: data?.id,
        customer_id: customer?.entityId,
      })
      setCookie('bc_cartId', data?.id)
    } else {
      if (customer?.attributes?.attribute.value) {
        setCookie('bc_cartId', customer?.attributes?.attribute.value)
      }
    }
    router.push('/profile')
    setLoading(false)
  }

  useEffect(() => {
    if (customer?.entityId) {
      setCartId()
    }
  }, [customer])

  const handleValidation = useCallback(() => {
    // Test for Alphanumeric password
    const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)

    // Unable to send form unless fields are valid.
    if (dirty) {
      setDisabled(!validate(email) || password.length < 7 || !validPassword)
    }
  }, [email, password, dirty])

  useEffect(() => {
    handleValidation()
  }, [handleValidation])

  return (
    <>
      <Header headerData={header?.data} />
      <div className="box-form absolute-heading">
        <h1 className="account-heading">Login</h1>
        <div className="bg-box">
          <div className="bg-box-head">
            <div className="flex dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <form onSubmit={handleLogin}>
            <div className="box-model">
              <div className="form-field">
                <Input type="text" placeholder="Email" onChange={setEmail} />
                {emailError && (
                  <div className="error-message text-red border-red">
                    <p className="text-red">Email is invalid</p>
                  </div>
                )}
              </div>
              <div className="form-field forgot-password">
                <Input
                  type="password"
                  placeholder="Password"
                  onChange={setPassword}
                />
                <Link href={'/forgot-password'}>
                  <a className="link">Forgot password?</a>
                </Link>
                {passwordError && (
                  <div className="error-message text-red border-red">
                    <p className="text-red">Password is required</p>
                  </div>
                )}
              </div>
              {message && (
                <div className="error-message flex align-v-center">
                  <WrongPassword />
                  {message}
                </div>
              )}

              <div className="mt-auto">
                <Button
                  variant="slim"
                  type="submit"
                  loading={loading}
                  // disabled={disabled}
                  className="btn"
                >
                  Login
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className="acc-or-signup learn-more">
          <span>Need a new account? </span>
          <Link href={'/signup'}>
            <a className="link">Sign up</a>
          </Link>
        </div>
      </div>
      <div className="mt50">
        <BuilderComponent model="symbol" />
      </div>
    </>
  )
}

Login.Layout = Layout
