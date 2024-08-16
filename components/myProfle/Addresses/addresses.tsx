import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useCustomersAddresses from '@framework/use-customers-addresses'
import { Button } from '@components/ui'
import AddessesLayout from './addessesLayout'
import { Plus } from '@components/icons'
import useDeleteAddress from '@framework/use-delete-address'
import Shipping from '@components/icons/Shippping'
import { ConfirmationModal } from '@components/ConfirmationModal'
import { useUI } from '@components/ui/context'

const Addresses = ({ data, setUpdateAddressOpen, updateAddressOpen }: any) => {
  const customersAddresses = useCustomersAddresses()
  const deleteAddress = useDeleteAddress()
  const router = useRouter()
  const [addresses, setAddresses] = useState<any>([{}])
  const [selectedAddress, setSelectedAddress] = useState()
  const [countriesData, setCountriesData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const { displayModal, closeModal } = useUI()
  const getUsers = async () => {
    const addressData: any = await customersAddresses({
      entityId: data?.entityId,
    })
    let countriesData: any = {}
    try {
      const response = await fetch(
        'https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code'
      )
      countriesData = await response.json()
      setCountriesData(countriesData)
    } catch (error) {
      console.error(error)
    }
    if (addressData.data) setIsLoading(false)
    else setIsLoading(true)

    setAddresses(addressData.data)
  }
  useEffect(() => {
    if (data == null) router.push('/login')
    getUsers()
  }, [data])

  // For scroll effect
  if (typeof document !== 'undefined') {
    const a: any = document.querySelector('.account-pages')
    a?.scrollTo({
      top: -60,
      behavior: 'smooth',
    })
  }

  const updateAddress = (addr: any) => {
    setUpdateAddressOpen(true)
    setSelectedAddress(addr)
  }

  const deleteCustomerAddress = async (addr: any) => {
    try {
      await deleteAddress({
        entityId: addr?.id,
      })
      getUsers()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="address-loader">
      {isLoading ? (
        <div className="loader-layout content-flex w-100">
          <span className="loader"></span>
        </div>
      ) : (
        <>
          {!addresses[0]?.id ? (
            <>
              {!!updateAddressOpen ? (
                <div
                  className={`addresses-grid ${
                    updateAddressOpen ? 'new-address' : ''
                  }`}
                >
                  <AddessesLayout
                    selectedAddress={selectedAddress}
                    countriesData={countriesData}
                    customerId={data?.entityId}
                    setUpdateAddressOpen={setUpdateAddressOpen}
                    getUsers={getUsers}
                  />
                </div>
              ) : (
                <div className="account-grid-new">
                  <div className="account-grid">
                    <div
                      className="circle content-flex"
                      onClick={() => {
                        setUpdateAddressOpen(true)
                        updateAddress({})
                      }}
                    >
                      <Plus />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              className={`addresses-grid ${
                updateAddressOpen ? 'new-address' : ''
              }`}
            >
              {!!updateAddressOpen ? (
                <AddessesLayout
                  selectedAddress={selectedAddress}
                  countriesData={countriesData}
                  customerId={data?.entityId}
                  setUpdateAddressOpen={setUpdateAddressOpen}
                  getUsers={getUsers}
                />
              ) : (
                <>
                  {!!addresses[0]?.id && (
                    <>
                      {addresses?.map((address: any, index: number) => (
                        <div key={index} className="shipping">
                          <div className="account-grid">
                            <div className="d-flex justify-space">
                              <h2>
                                {address.first_name + ' ' + address.last_name}
                              </h2>
                              <Shipping />
                            </div>
                            <div className="form-field">
                              <label>Address</label>
                              <p>{address.address1}</p>
                            </div>
                            <div className="form-field">
                              <label>City</label>
                              <p>{address.city}</p>
                            </div>
                            <div className="form-field">
                              <label>Zip/Postal Code</label>
                              <p>{address.postal_code}</p>
                            </div>
                            <div className="form-field">
                              <label>State/Province</label>
                              <p>{address.state_or_province}</p>
                            </div>
                            <div className="form-field">
                              <label>Country</label>
                              <p>{address.country}</p>
                            </div>
                            <div className="mt-2                                                                                                                                                       md:mt-5 d-flex justify-space">
                              <Button
                                variant="slim"
                                className="btn"
                                onClick={() => updateAddress(address)}
                              >
                                Update
                              </Button>
                              <div>
                                <ConfirmationModal
                                  open={displayModal}
                                  onClose={closeModal}
                                  heading={<>Are you sure ?</>}
                                  deleteCustomerAddress={deleteCustomerAddress}
                                  address={address}
                                  text={
                                    <>
                                      Are you sure, you want to delete this
                                      address?
                                    </>
                                  }
                                  button={<>Delete</>}
                                >
                                </ConfirmationModal>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  <div className="account-grid-new">
                    <div className="account-grid">
                      <div
                        className="circle content-flex"
                        onClick={() => {
                          setUpdateAddressOpen(true)
                          updateAddress({})
                        }}
                      >
                        <Plus />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Addresses
