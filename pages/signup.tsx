import type { InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Select from 'react-select'
import builder, { BuilderComponent } from '@builder.io/react'
import { validate } from 'email-validator'
import useSignup from '@framework/use-signup'
import { Layout } from '@components/common'
import { Button, Input } from '@components/ui'
import Header from '@components/BuilderHeader/Header'

export async function getStaticProps() {
  const header = await builder.get('header').toPromise()
  let countriesData: any = {}
  try {
    const response = await fetch(
      'https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code'
    )
    countriesData = await response.json()
  } catch (error) {
    console.error(error)
  }

  return {
    props: { header, countriesData },
    revalidate: 14400,
  }
}

export default function SignUp({
  header,
  countriesData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state_or_province: '',
    postal_code: '',
    country_code: countriesData?.userSelectValue?.value,
  })

  const [errors, setErrors] = useState<any>({})
  const [apiError, setApiError] = useState<any>('')
  const [loading, setLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<any>(
    countriesData?.userSelectValue
  )
  const router = useRouter()

  const signup = useSignup()

  if (typeof window !== 'undefined') {
    document.querySelector('#body')?.setAttribute('data-theme', 'dark')
    document.querySelector('html')?.removeAttribute('data-theme')
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }))
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [field]: false,
    }))
  }

  const handleSignup = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()
    const validPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/.test(
        formData.password
      )

    errors.email = !validate(formData.email)
    errors.firstName = !formData.firstName.length
    errors.confirmPassword = formData.password !== formData.confirmPassword
    errors.password = !formData.password.length
    errors.passwordInvalid = formData.password.length && !validPassword
    errors.lastName = !formData.lastName.length
    errors.address1 = !formData.address1.length
    errors.city = !formData.city.length
    errors.country_code = !formData.country_code.length

    setErrors({
      email: !validate(formData.email),
      firstName: !formData.firstName.length,
      confirmPassword: formData.password !== formData.confirmPassword,
      password: !formData.password.length,
      passwordInvalid: formData.password.length && !validPassword,
      lastName: !formData.lastName.length,
      address1: !formData.address1.length,
      city: !formData.city.length,
      country_code: !formData.country_code.length,
    })

    if (Object.values(errors).some((error) => error)) {
      return
    }

    try {
      setLoading(true)
      await signup(formData)
      setLoading(false)
      router.push('/profile')
    } catch (errors: any) {
      setApiError(errors.errors[0]?.message)
      setLoading(false)
    }
  }

  return (
    <>
      <Header headerData={header?.data} />
      <div className="signup-page box-form absolute-heading">
        <h1 className="account-heading">Sign Up</h1>
        <div className="bg-box">
          <div className="bg-box-head">
            <div className="flex dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <form onSubmit={handleSignup}>
            <div className="box-model">
              {!!apiError && (
                <div className="error-message text-red border-red">
                  {apiError}
                </div>
              )}
              <div className="form-field">
                <Input
                  type="text"
                  className={`required-field ${
                    errors.email ? 'has-error' : ''
                  }`}
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e)}
                />
                {!!errors.email && (
                  <div className="error-message text-red border-red">
                    Email is invalid
                  </div>
                )}
              </div>
              <div className="form-field">
                <Input
                  type="password"
                  placeholder="Password"
                  className="required-field"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e)}
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
              <div className="form-field">
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="required-field"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e)}
                />
                {!!errors.confirmPassword && (
                  <div className="error-message text-red border-red">
                    Confirm Password and password doesn't match
                  </div>
                )}
              </div>
              <div className="form-field">
                <Input
                  placeholder="First Name"
                  className="required-field"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e)}
                />
                {!!errors.firstName && (
                  <div className="error-message text-red border-red">
                    First Name is required
                  </div>
                )}
              </div>
              <div className="form-field">
                <Input
                  placeholder="Last Name"
                  className="required-field"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e)}
                />
                {!!errors.lastName && (
                  <div className="error-message text-red border-red">
                    Last Name is required
                  </div>
                )}
              </div>
              <div className="form-field">
                <Input
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e)}
                />
              </div>
              <div className="form-field">
                <Input
                  placeholder="Address"
                  className="required-field"
                  value={formData.address1}
                  onChange={(e) => handleInputChange('address1', e)}
                />
                {!!errors.address1 && (
                  <div className="error-message text-red border-red">
                    Address is required
                  </div>
                )}
              </div>
              <div className="form-field">
                <Input
                  placeholder="Address Line 2"
                  value={formData.address2}
                  onChange={(e) => handleInputChange('address2', e)}
                />
              </div>
              <div className="form-field">
                <Input
                  placeholder="City"
                  className="required-field"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e)}
                />
                {!!errors.city && (
                  <div className="error-message text-red border-red">
                    City is required
                  </div>
                )}
              </div>
              <div className="flex col">
                <div className="form-field">
                  <Input
                    placeholder="State/Province"
                    value={formData.state_or_province}
                    onChange={(e) => handleInputChange('state_or_province', e)}
                  />
                </div>
                <div className="form-field">
                  <Input
                    placeholder="Zip/Postal Code"
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e)}
                  />
                </div>
              </div>
              <div className="form-field">
                <Select
                  className="select-2 required-field"
                  options={countriesData?.countries}
                  value={selectedCountry}
                  onChange={(selectedOption: any) => {
                    handleInputChange('country_code', selectedOption.value)
                    setSelectedCountry(selectedOption)
                  }}
                />
                {!!errors.country_code && (
                  <div className="error-message text-red border-red">
                    Country is required
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <Button
                  variant="slim"
                  type="submit"
                  loading={loading}
                  className="btn"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className="acc-or-signup learn-more">
          <span>Have an account?</span>
          <Link href={'/login'}>
            <a className="link">Login</a>
          </Link>
        </div>
      </div>
      <div className="mt50">
        <BuilderComponent model="symbol" />
      </div>
    </>
  )
}

SignUp.Layout = Layout
