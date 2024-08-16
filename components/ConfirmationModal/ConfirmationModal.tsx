import { FC, useRef, useEffect, useCallback, useState } from 'react'
import s from '../common/Navbar/Navbar.module.css'
import { Portal } from '@reach/portal'
import { Cross } from '@components/icons'
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock'
interface Props {
  text?: any
  deleteCustomerAddress?: any
  address?: any
  button?: any
  heading?: any
  className?: string
  children?: any
  open?: boolean
  onClose: () => void
  onEnter?: () => void | null
}

const ConfirmationModal: FC<Props> = ({
  text,
  deleteCustomerAddress,
  address,
  button,
  heading,
  open,
}: any) => {
  const [showModal, setShowModal] = useState(false)
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        return setShowModal(false)
      }
    },
    [showModal]
  )

  useEffect(() => {
    if (ref.current) {
      if (showModal) {
        disableBodyScroll(ref.current)
        window.addEventListener('keydown', handleKey)
      } else {
        enableBodyScroll(ref.current)
      }
    }
    return () => {
      window.removeEventListener('keydown', handleKey)
      clearAllBodyScrollLocks()
    }
  }, [open, handleKey])

  return (
    <>
      <button className="btn" type="button" onClick={() => setShowModal(true)}>
        {button}
      </button>
      <Portal>
        <div className={s.root}>
          <div className={s.modal} role="dialog">
            {showModal ? (
              <>
                <div className="modal flex flex-direction justify-center items-center">
                  <div>
                    <h3>{heading}</h3>
                    <button
                      onClick={() => setShowModal(false)}
                      aria-label="Close panel"
                      className="hover:text-gray-500 transition ease-in-out duration-150 focus:outline-none absolute right-0 top-0 m-6"
                    >
                      <Cross className="h-6 w-6" />
                    </button>
                  </div>
                  <p>{text}</p>
                  <div className="space-10">
                    <button
                      className="btn"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="btn danger"
                      type="button"
                      onClick={() => {
                        deleteCustomerAddress(address)
                        setShowModal(false)
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </Portal>
    </>
  )
}
export default ConfirmationModal
