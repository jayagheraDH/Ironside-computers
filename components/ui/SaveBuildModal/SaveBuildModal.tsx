import { Cross } from '@components/icons'
import axios from 'axios'
import React, { useState } from 'react'

interface SaveBuildModalProps {
  setSaveMyBuildModal: any
  url: any
  options: any
  totalPrice: any
  productDescription?: any
  productImage?: any
}

const SaveBuildModal = ({
  setSaveMyBuildModal,
  url,
  options,
  totalPrice,
  productDescription,
  productImage,
}: SaveBuildModalProps) => {
  const emailApiUrl = 'https://fair-conduit-404516.uc.r.appspot.com/saveBuild'
  const [copyClicked, setCopyClicked] = useState(false)
  const [emailClicked, setEmailClicked] = useState(false)
  const [email, setEmail] = useState('')
  const sendBuildEmail = async () => {
    const emailData = {
      productUrl: url,
      email: email,
      desc: options,
      productName: productDescription?.join(''),
      productImage: productImage?.length
        ? productImage
        : '',
      price: totalPrice,
    }

    try {
      await axios.post(emailApiUrl, emailData).then((response) => {
        if (response.status === 200) {
          setEmailClicked(true)
        }
      })
    } catch (errors: any) {
      setEmailClicked(true)
      console.error(errors)
    }
  }
  return (
    <div className="modal saveMyBuild" style={{ maxWidth: '442px' }}>
      <h2 className="align-center">Save My Build</h2>
      <button
        className="modal-close"
        onClick={() => {
          setCopyClicked(false)
          setEmailClicked(false)
          setSaveMyBuildModal(false)
        }}
      >
        <Cross />
      </button>
      <div>
        <div className="align-center">
          <label>Custom URL</label>
          <div className="custom-box flex align-v-center">
            <input placeholder={url} />
            <button
              className="btn-small"
              onClick={() => {
                navigator.clipboard.writeText(url)
                setCopyClicked(true)
                setEmailClicked(false)
              }}
            >
              {copyClicked ? 'copied' : 'copy'}
            </button>
          </div>
        </div>
        <div className="align-center">
          <label>Email</label>
          <div className="custom-box flex align-v-center">
            <input
              placeholder="Enter email address"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            ></input>
            <button
              className="btn-small"
              onClick={() => {
                sendBuildEmail()
              }}
            >
              {emailClicked ? 'sent' : 'Email'}
            </button>
          </div>
        </div>
        <div className="spec-list">
          <p className="head">
            <span>Spec List</span>
          </p>
          <div className="product-description" data-lenis-prevent>
            {options?.map((opt: any, index: number) => (
              <div key={index} className="flex flex-col text-base">
                <span>{opt?.category_name || opt?.name}: </span>
                <span>{opt?.product_name || opt?.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex justify-end align-v-center copy-bottom">
          <label>Total: {totalPrice}</label>
          <button
            className="btn-small"
            onClick={() => {
              navigator.clipboard.writeText(url)
              setCopyClicked(true)
              setEmailClicked(false)
            }}
          >
            {copyClicked ? 'copied' : 'copy'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SaveBuildModal
