import { Cross } from '@components/icons'
import axios from 'axios'
import React, { useState } from 'react'
import { Button, Input } from '@components/ui'
import { validate } from 'email-validator'

interface AdminUserModalProps {
  setAddUserPopUp: any
}

const AdminUserModal = ({ setAddUserPopUp }: AdminUserModalProps) => {
  const adminRegisterUrl =
    'https://fair-conduit-404516.uc.r.appspot.com/admin/user'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<any>({})
  const [apiError, setApiError] = useState<any>('')
  const [loading, setLoading] = useState(false)
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
    setLoading(true)
    const validPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/.test(
        formData.password
      )

    errors.email = !validate(formData.email)
    errors.confirmPassword = formData.password !== formData.confirmPassword
    errors.password = !formData.password.length
    errors.passwordInvalid = formData.password.length && !validPassword

    setErrors({
      email: !validate(formData.email),
      confirmPassword: formData.password !== formData.confirmPassword,
      password: !formData.password.length,
      passwordInvalid: formData.password.length && !validPassword,
    })

    if (Object.values(errors).some((error) => error)) {
      setLoading(false)
      return
    }
    try {
      await axios.post(adminRegisterUrl, formData).then((response) => {
        if (response.status === 200) {
          setLoading(false)
          setAddUserPopUp(false)
        }
      })
    } catch (errors: any) {
      setApiError(errors.errors[0]?.message)
      setLoading(false)
    }
  }
  return (
    <div className="modal" style={{ maxWidth: '442px' }}>
      <h2 className="align-center">Add User</h2>
      <button
        className="modal-close"
        onClick={() => {
          setAddUserPopUp(false)
        }}
      >
        <Cross />
      </button>
      <form onSubmit={handleSignup}>
        <div className="box-model">
          {!!apiError && (
            <div className="error-message text-red border-red">{apiError}</div>
          )}
          <div className="form-field">
            <Input
              type="text"
              className={`required-field ${errors.email ? 'has-error' : ''}`}
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
                Password must have at least one letter, one special character,
                and one number.
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
  )
}

export default AdminUserModal
