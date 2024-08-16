import s from './Sidebar.module.css'
import Portal from '@reach/portal'
import { FC, useEffect, useRef } from 'react'
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock'

interface Props {
  children: any
  open: boolean
  onClose: () => void
}

const Sidebar: FC<Props> = ({ children, open = false, onClose }) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>

  useEffect(() => {
    if (ref.current) {
      if (open) {
        disableBodyScroll(ref.current)
      } else {
        enableBodyScroll(ref.current)
      }
    }
    return () => {
      clearAllBodyScrollLocks()
    }
  }, [open])

  return (
    <Portal>
      {open ? (
        <div className={s.root + ' cart-sidebar'} ref={ref}>
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 transition-opacity"
              onClick={onClose}
            />
            <section className="cart-sidebar-width absolute right-0" data-lenis-prevent>
              {children}
            </section>
          </div>
        </div>
      ) : null}
    </Portal>
  )
}

export default Sidebar
