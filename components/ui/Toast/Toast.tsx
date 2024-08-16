import { Portal } from '@reach/portal'
import React, { useEffect } from 'react'
import { ToastContainer, toast, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Toast = ({ toastText }: any) => {
  const notify = () => {
    toast.success(toastText)
  }
  notify()  

  return (
    <Portal>
      <ToastContainer
        transition={Flip}
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
      />
    </Portal>
  )
}

export default Toast
