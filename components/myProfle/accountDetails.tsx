import { useEffect, useState } from 'react'
import { validate } from 'email-validator'
import useCustomer from '@framework/use-customer'
import useUpdateCustomer from '@framework/use-update-customer'
import { Button } from '@components/ui'
import MyInfo from '@components/icons/MyInfo'
import Password from '@components/icons/Password'

const AccountDetails: any = () => {
  const { data } = useCustomer()
  const [errors, setErrors] = useState({
    email: false,
    firstName: false,
    lastName: false,
    newPassword: false,
    confirmPassword: false,
  })

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    entityId: 0,
    newPassword: '',
    confirmPassword: '',
  })

  const [loading1, setLoading1] = useState(false)
  const [apiError, setApiError] = useState<any>('')
  const [loading2, setLoading2] = useState(false)
  const updateCustomer = useUpdateCustomer()

  useEffect(() => {
    setFormData({
      email: data?.email ? data?.email : '',
      firstName: data?.firstName ? data?.firstName : '',
      lastName: data?.lastName ? data?.lastName : '',
      phone: data?.phone ? data?.phone : '',
      entityId: data?.entityId ? data?.entityId : 0,
      newPassword: '',
      confirmPassword: '',
    })
  }, [data])

  // For scroll effect
  if (typeof document !== 'undefined') {
    const a: any = document.querySelector('.account-pages')
    a?.scrollTo({
      top: -60,
      behavior: 'smooth',
    })
  }

  const handleInputChange = (field: string, e: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }))
  }

  const handleUpdateProflie = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()
    const validationErrors = {
      email: !validate(formData?.email),
      firstName: !formData?.firstName.length,
      lastName: !formData?.lastName.length,
      newPassword: false,
      confirmPassword: false,
    }
    setErrors(validationErrors)

    if (Object.values(validationErrors).some((error) => error)) {
      return
    }

    try {
      setLoading1(true)
      await updateCustomer(formData)
      setLoading1(false)
    } catch ({ errors }: any) {
      setLoading1(false)
    }
  }

  const handleUpdatePassword = async (e: React.SyntheticEvent<EventTarget>) => {
    const validPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/.test(
        formData.newPassword
      )

    e.preventDefault()
    const validationErrors = {
      email: false,
      firstName: false,
      lastName: false,
      confirmPassword:
        !formData.confirmPassword.length ||
        formData.newPassword !== formData.confirmPassword,
      newPassword: !formData.newPassword.length || !validPassword,
    }
    setErrors(validationErrors)

    if (Object.values(validationErrors).some((error) => error)) {
      return
    }

    try {
      setLoading2(true)
      await updateCustomer(formData)
      setLoading2(false)
    } catch (errors: any) {
      setApiError(errors[0]?.message)
      setLoading2(false)
    }
  }

  return (
    <div className='address-loader'>
      {!data ? (
        <div className="content-flex w-100">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="addresses-grid">
          {data && (
            <div className='my-info'>
              <form onSubmit={handleUpdateProflie} className="account-grid">
                <div>
                  <div className="form-field">
                    <div className="d-flex justify-between">
                      <h2>My Info</h2>
                      <MyInfo />
                    </div>
                    <label>First Name</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      defaultValue={data.firstName}
                      onChange={(e) => handleInputChange('firstName', e)}
                    />
                  </div>
                  {!!errors.firstName && (
                    <div className="error-message text-red border-red">
                      First Name is required
                    </div>
                  )}
                  <div className="form-field">
                    <label>Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      defaultValue={data.lastName}
                      onChange={(e) => handleInputChange('lastName', e)}
                    />
                    {!!errors.lastName && (
                      <div className="error-message text-red border-red">
                        Last Name is required
                      </div>
                    )}
                  </div>
                  <div className="form-field">
                    <label>Phone</label>
                    <input
                      type="text"
                      placeholder="Phone"
                      defaultValue={data.phone}
                      onChange={(e) => handleInputChange('phone', e)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Email"
                      defaultValue={data.email}
                      onChange={(e) => handleInputChange('email', e)}
                    />
                    {!!errors.email && (
                      <div className="error-message text-red border-red">
                        Email is required
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-auto">
                  <Button
                    variant="slim"
                    type="submit"
                    loading={loading1}
                    disabled={loading2 ? true : false}
                    className="btn"
                  >
                    Update
                  </Button>
                </div>
              </form>
            </div>
          )}
          <div className='password'>
            <form onSubmit={handleUpdatePassword} className="account-grid">
              <div>
                {!!apiError && (
                  <div className="error-message text-red border-red">
                    {apiError}
                  </div>
                )}
                <div className="form-field">
                  <div className="d-flex justify-space">
                    <h2>Password</h2>
                    <Password />
                  </div>
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) => handleInputChange('newPassword', e)}
                  />
                  {!!errors.newPassword && (
                    <div className="error-message text-red border-red">
                      Password must have at least one letter, one special
                      character, and one number.
                    </div>
                  )}
                </div>
                <div className="form-field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Enter Confirm Password"
                    onChange={(e) => handleInputChange('confirmPassword', e)}
                  />
                  {!!errors.confirmPassword && (
                    <div className="error-message text-red border-red">
                      Confirm Password is incorrect
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-auto">
                <Button
                  variant="slim"
                  type="submit"
                  loading={loading2}
                  disabled={loading1 ? true : false}
                  className="btn"
                >
                  Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountDetails
