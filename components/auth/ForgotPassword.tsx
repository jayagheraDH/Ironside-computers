import { FC, useEffect, useState, useCallback } from 'react'
import { validate } from 'email-validator'
import { useUI } from '@components/ui/context'
import { Logo, Button, Input } from '@components/ui'

interface Props {}

const ForgotPassword: FC<Props> = () => {
  // Form State
  const [email, setEmail] = useState('')
  const [dirty, setDirty] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const { setModalView } = useUI()

  const handleResetPassword = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()

    if (!dirty && !disabled) {
      setDirty(true)
      handleValidation()
    }
  }

  const handleValidation = useCallback(() => {
    // Unable to send form unless fields are valid.
    if (dirty) {
      setDisabled(!validate(email))
    }
  }, [email, dirty])

  useEffect(() => {
    handleValidation()
  }, [handleValidation])

  return (
    <form
      onSubmit={handleResetPassword}
      className="w-80 flex flex-col justify-between p-3"
    >
      <div className="flex justify-center pb-12 ">
        <Logo width="64px" height="64px" />
      </div>
      <div className="flex flex-col space-y-4">
        <Input placeholder="Email" onChange={setEmail} type="email" />
        <div className="pt-2 w-full flex flex-col">
          <Button
            variant="slim"
            type="submit"
            loading={false}
            disabled={disabled}
          >
            Recover Password
          </Button>
        </div>

        <span className="pt-3 text-center text-sm">
          <span className="text-accents-7">Do you have an account?</span>
          {` `}
          <a
            className="text-accent-9 font-bold hover:underline cursor-pointer"
            onClick={() => setModalView('LOGIN_VIEW')}
          >
            Log In
          </a>
        </span>
      </div>
    </form>
  )
}

export default ForgotPassword
