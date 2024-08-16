import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { validate } from 'email-validator'
import { BuilderComponent, builder } from '@builder.io/react'
import Header from '@components/BuilderHeader/Header'
import { Button, Input } from '@components/ui'
import { Layout } from '@components/common'
import { ToastContainer, toast, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Portal } from '@reach/portal'

export async function getStaticProps() {
  const header = await builder.get('header').toPromise()

  return {
    props: { header },
    revalidate: 14400,
  }
}

export default function forgotPassword({ header }: any) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [customerId, setCustomerId] = useState()
  const [errors, setErrors] = useState<any>({})
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [successMessage, setSuccessMessage] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [emailApiError, setEmailApiError] = useState(false)
  const [isResetPage, setIsResetPage] = useState(true)
  const updateAdminPassword =
    'https://fair-conduit-404516.uc.r.appspot.com/admin/updateAdminPassword'
  const checkSession =
    'https://fair-conduit-404516.uc.r.appspot.com/big-commerce/check-session'
  const resetPasswordApiUrl =
    'https://fair-conduit-404516.uc.r.appspot.com/admin/resetPassword'
  const router = useRouter()

  if (typeof window !== 'undefined') {
    document.querySelector('#body')?.setAttribute('data-theme', 'dark')
    document.querySelector('html')?.removeAttribute('data-theme')
  }
  const handleForgotPassword = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()
    const validPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/.test(password)

    errors.confirmPassword = password !== confirmPassword
    errors.password = !password.length
    errors.passwordInvalid = password.length && !validPassword

    setErrors({
      confirmPassword: password !== confirmPassword,
      password: !password.length,
      passwordInvalid: password.length && !validPassword,
    })

    if (Object.values(errors).some((error) => error)) {
      return
    }

    try {
      setLoading(true)
      const adminData = { password, confirmPassword, adminId: customerId }
      await axios.post(updateAdminPassword, adminData).then(
        (response) => {
          setLoading(false)
          if (response.status === 200) {
            router.push('/admin-auth-login')
          }
        },
        (error) => {
          setEmailApiError(true)
          setLoading(false)
          return
        }
      )
    } catch (errors: any) {
      setLoading(false)
    }
  }

  const handleResetRequest = async (e: React.SyntheticEvent<EventTarget>) => {
    setEmailError(false)

    e.preventDefault()
    if (!validate(email)) {
      setEmailError(true)
      return
    }
    const resetData = {
      email: email,
    }

    try {
      setLoading(true)
      await axios.post(resetPasswordApiUrl, resetData).then(
        (response) => {
          setLoading(false)
          if (response.status === 200) {
            setSuccessMessage(true)
          }
        },
        () => {
          setEmailApiError(true)
          setLoading(false)
          return
        }
      )
    } catch (errors: any) {
      setLoading(false)
    }
  }

  const checkUserSession = async (sessionId: string) => {
    const data: any = { token: sessionId }
    await axios
      .post(checkSession, data)
      .then(() => {
        setIsResetPage(false)
        const decoded: any = jwt_decode(sessionId)
        setToken(sessionId)
        setCustomerId(decoded.adminId)
      })
      .catch((err) => {
        notify()
        return
      })
  }

  const notify = () => {
    toast.error('Session expired!')
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const c_id = urlParams.get('_c')
    if (c_id) {
      checkUserSession(c_id)
    } else {
      setIsResetPage(true)
    }
  }, [])

  return (
    <>
      <Header headerData={header?.data} />
      {isResetPage ? (
        <div className="box-form absolute-heading">
          <h1 className="account-heading">Admin Reset</h1>
          <div className="bg-box">
            <div className="bg-box-head">
              <div className="flex dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <form onSubmit={handleResetRequest}>
              <div className="box-model">
                <p>
                  Please enter the email address you'd like your password reset
                  information sent to
                </p>
                <div className="form-field forgot-password">
                  <Input type="email" placeholder="Email" onChange={setEmail} />
                  {emailError && (
                    <div className="error-message text-red border-red">
                      <p className="text-red">
                        Please use a valid email address
                      </p>
                    </div>
                  )}
                  {emailApiError && (
                    <div className="error-message text-red border-red">
                      <p className="text-red">Customer not found.</p>
                    </div>
                  )}
                </div>
                {!!successMessage && (
                  <div className="reset-success">
                    <p className="text-green">
                      Email sent successfully! <br />
                      Please check your inbox or junk mail.
                    </p>
                  </div>
                )}

                <div className="mt-auto">
                  <Button
                    variant="slim"
                    type="submit"
                    loading={loading}
                    className="btn"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div className="acc-or-signup learn-more">
            <span>Go back to login </span>
            <Link href={'/login'}>
              <a className="link">Log In</a>
            </Link>
          </div>
        </div>
      ) : (
        <div className="box-form absolute-heading">
          <h1 className="account-heading">Reset</h1>
          <div className="bg-box">
            <div className="bg-box-head">
              <div className="flex dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <form onSubmit={handleForgotPassword}>
              <div className="box-model">
                <div className="form-field forgot-password">
                  <Input
                    type="password"
                    placeholder="Password"
                    onChange={setPassword}
                  />
                  {!!errors.password && (
                    <div className="error-message text-red border-red">
                      Password is required
                    </div>
                  )}
                  {!!errors.passwordInvalid && (
                    <div className="error-message text-red border-red">
                      Password must have at least one letter, one special
                      character, and one number.
                    </div>
                  )}
                </div>
                <div className="form-field forgot-password">
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    onChange={setConfirmPassword}
                  />
                  {!!errors.confirmPassword && (
                    <div className="error-message text-red border-red">
                      Confirm Password and password doesn't match.
                    </div>
                  )}
                </div>
                {!!emailApiError && (
                  <div className="error-message text-red border-red">
                    <p className="text-red">This link has been expired.</p>
                  </div>
                )}
                <div className="mt-auto">
                  <Button
                    variant="slim"
                    type="submit"
                    loading={loading}
                    className="btn"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div className="acc-or-signup learn-more">
            <span>Go back to login </span>
            <Link href={'/login'}>
              <a className="link">Log In</a>
            </Link>
          </div>
        </div>
      )}
      <div className="mt50">
        <BuilderComponent model="symbol" />
      </div>
      <Portal>
        <ToastContainer
          transition={Flip}
          position="bottom-right"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="dark"
        />
      </Portal>
    </>
  )
}

forgotPassword.Layout = Layout
