import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
import { BuilderComponent, builder } from '@builder.io/react'
import axios from 'axios'
import { AES } from 'crypto-js'
import { validate } from 'email-validator'
import { Layout } from '@components/common'
import { Button, Input } from '@components/ui'
import Header from '@components/BuilderHeader/Header'
import Link from 'next/link'

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const header = await builder.get('header').toPromise()

  return {
    props: { header },
    revalidate: 14400,
  }
}

export default function AdminAuth({
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
  const router = useRouter()

  const handleAdminAuth = async (e: React.SyntheticEvent<EventTarget>) => {
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

    const cipherText = AES.encrypt(password, '#we$$12@@*6sj3SE7667^&^KK')
    const loginData = {
      email: email,
      password: cipherText.toString(),
    }

    try {
      setLoading(true)
      setMessage('')
      const result = await axios.post(
        `https://fair-conduit-404516.uc.r.appspot.com/admin/login`,
        loginData,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'Application/json',
          },
        }
      )
      const jwtToken = result.data.data.jwtToken
      localStorage.setItem('jwtToken', jwtToken)
      router.push(`/secret-url`)
    } catch (errors: any) {
      // @ts-ignore next-line
      setMessage('Internal server error')
      console.error(errors)
      setLoading(false)
    }
  }

  const handleValidation = useCallback(() => {
    // Test for Alphanumeric password
    const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)

    // Unable to send form unless fields are valid.
    if (dirty) {
      setDisabled(!validate(email) || password.length < 7 || !validPassword)
    }
  }, [email, password, dirty])

  if (typeof window !== 'undefined') {
    document.querySelector('#body')?.setAttribute('data-theme', 'dark')
    document.querySelector('html')?.removeAttribute('data-theme')
  }

  useEffect(() => {
    handleValidation()
  }, [handleValidation])

  return (
    <>
      <Header headerData={header?.data} />
      <div className="box-form absolute-heading">
        <h1 className="account-heading">Admin Login</h1>
        <div className="bg-box">
          <div className="bg-box-head">
            <div className="flex dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <form onSubmit={handleAdminAuth}>
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
                <Link href={'/admin-forgot-password'}>
                  <a className="link">Forgot password?</a>
                </Link>
                {passwordError && (
                  <div className="error-message text-red border-red">
                    <p className="text-red">Password is required</p>
                  </div>
                )}
              </div>
              {message && (
                <div className="error-message text-red border-red">
                  {message}
                </div>
              )}

              <div className="mt-auto">
                <Button
                  variant="slim"
                  type="submit"
                  loading={loading}
                  className="btn"
                >
                  Login
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="mt50">
        <BuilderComponent model="symbol" />
      </div>
    </>
  )
}

AdminAuth.Layout = Layout
