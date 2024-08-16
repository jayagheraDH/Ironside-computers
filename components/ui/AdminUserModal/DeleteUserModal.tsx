import { Cross } from '@components/icons'
import axios from 'axios'
import React, { useState } from 'react'
import { Button, Input } from '@components/ui'
import { validate } from 'email-validator'

interface DeleteUserModalProps {
  setDeleteUserPopUp: any
}

const DeleteUserModal = ({ setDeleteUserPopUp }: DeleteUserModalProps) => {
  const [formData, setFormData] = useState({
    email: '',
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
    errors.email = !validate(formData.email)
    setErrors({
      email: !validate(formData.email),
    })
    if (Object.values(errors).some((error) => error)) {
      setLoading(false)
      return
    }
    try {
      await axios
        .delete(
          `https://fair-conduit-404516.uc.r.appspot.com/admin/deleteUser?email=${formData.email}`
        )
        .then(() => {
          setLoading(false)
          setDeleteUserPopUp(false)
        })
        .catch((error) => {
          setApiError('User Not Found!')
          setLoading(false)
          console.error(error)
        })
    } catch (errors: any) {
      setApiError(errors.errors[0]?.message)
      setLoading(false)
    }
  }
  return (
    <div className="modal" style={{ maxWidth: '442px' }}>
      <h2 className="align-center">Delete User</h2>
      <button
        className="modal-close"
        onClick={() => {
          setDeleteUserPopUp(false)
        }}
      >
        <Cross />
      </button>
      <form onSubmit={handleSignup}>
        <div className="box-model">
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
          {!!apiError && (
            <div className="error-message text-red border-red">{apiError}</div>
          )}
          <div className="mt-auto">
            <Button
              variant="slim"
              type="submit"
              loading={loading}
              className="btn"
            >
              Delete
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default DeleteUserModal
