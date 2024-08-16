import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { Button, Input } from '@components/ui'
import useUpdateAddress from '@framework/use-update-address'
import useCreateAddress from '@framework/use-create-address'

const AddessesLayout = ({
  selectedAddress,
  countriesData,
  customerId,
  setUpdateAddressOpen,
  getUsers,
}: any) => {
  const [selectedCountry, setSelectedCountry] = useState<any>(
    selectedAddress?.country_code
      ? {
          value: selectedAddress?.country_code,
          label: `g${selectedAddress?.country}`,
        }
      : ''
  )
  const [errors, setErrors] = useState({
    first_name: false,
    last_name: false,
    addr1: false,
    city: false,
    country_code: false,
    zip: false,
  })

  const [formData, setFormData] = useState({
    id: selectedAddress?.id,
    first_name: '',
    last_name: '',
    phone: '',
    addr1: '',
    addr2: '',
    city: '',
    country_code: countriesData?.userSelectValue?.value,
    state: '',
    zip: '',
    customer_id: customerId,
  })
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<any>('')
  const updateAddress = useUpdateAddress()
  const createAddress = useCreateAddress()

  useEffect(() => {
    setFormData({
      id: selectedAddress?.id,
      first_name: selectedAddress?.first_name
        ? selectedAddress?.first_name
        : '',
      last_name: selectedAddress?.last_name ? selectedAddress?.last_name : '',
      phone: selectedAddress?.phone ? selectedAddress?.phone : '',
      addr1: selectedAddress?.address1 ? selectedAddress?.address1 : '',
      addr2: selectedAddress?.address2 ? selectedAddress?.address2 : '',
      city: selectedAddress?.city ? selectedAddress?.city : '',
      country_code: selectedAddress ? selectedAddress?.country_code : '',
      state: selectedAddress?.state_or_province
        ? selectedAddress?.state_or_province
        : '',
      zip: selectedAddress?.postal_code ? selectedAddress?.postal_code : '',
      customer_id: customerId,
    })
  }, [selectedAddress])

  // For scroll effect
  if (typeof document !== 'undefined') {
    const a: any = document.querySelector('.account-pages')
    a?.scrollTo({
      top: -60,
      behavior: 'smooth',
    })
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

  const handleSubmit = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()

    setErrors({
      first_name: !formData.first_name.length,
      last_name: !formData.last_name.length,
      addr1: !formData.addr1.length,
      city: !formData.city.length,
      country_code: !formData.country_code?.length,
      zip: !formData.zip.length,
    })

    if (Object.values(errors).some((error) => error)) {
      return
    }

    if (formData.id === undefined) {
      delete formData.id
      try {
        setLoading(true)
        await createAddress(formData)
        getUsers()
        setLoading(false)
        setUpdateAddressOpen(false)
      } catch (errors: any) {
        setApiError(errors[0]?.message)
        setLoading(false)
      }
    } else {
      try {
        setLoading(true)
        await updateAddress(formData)
        getUsers()
        setLoading(false)
        setUpdateAddressOpen(false)
      } catch (errors: any) {
        setApiError(errors[0]?.message)
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <div className="account-grid">
        <form onSubmit={handleSubmit}>
          <div className="box-model">
            {!!apiError && (
              <div className="error-message text-red">{apiError}</div>
            )}
            <div className="form-field">
              <Input
                type="text"
                className={`required-field ${
                  errors.first_name ? 'has-error' : ''
                }`}
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e)}
              />
              {!!errors.first_name && (
                <div className="error-message text-red">
                  First Name is required
                </div>
              )}
            </div>
            <div className="form-field">
              <Input
                type="text"
                className={`required-field ${
                  errors.last_name ? 'has-error' : ''
                }`}
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e)}
              />
              {!!errors.last_name && (
                <div className="error-message text-red">
                  Last Name is required
                </div>
              )}
            </div>
            <div className="form-field">
              <Input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e)}
              />
            </div>
            <div className="form-field">
              <Input
                placeholder="Address"
                className="required-field"
                value={formData.addr1}
                onChange={(e) => handleInputChange('addr1', e)}
              />
              {!!errors.addr1 && (
                <div className="error-message text-red">
                  Address is required
                </div>
              )}
            </div>
            <div className="form-field">
              <Input
                placeholder="Address Line 2"
                value={formData.addr2}
                onChange={(e) => handleInputChange('addr2', e)}
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
                <div className="error-message text-red">City is required</div>
              )}
            </div>
            <div className="form-field">
              <Input
                placeholder="State/Province"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e)}
              />
            </div>
            <div className="form-field">
              <Input
                placeholder="Zip/Postal Code"
                value={formData.zip}
                onChange={(e) => handleInputChange('zip', e)}
              />
              {!!errors.zip && (
                <div className="error-message text-red">
                  Zip/Postal Code is required
                </div>
              )}
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
                <div className="error-message text-red">
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
                Update
              </Button>
              <Button
                variant="slim"
                className="btn"
                onClick={() => setUpdateAddressOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddessesLayout
