import Link from 'next/link'
import React from 'react'

export const Error404 = () => {
  return (
    <div className="box-form absolute-heading 404-page">
      <h1 className="account-heading">404</h1>
      <div className="bg-box">
        <div className="bg-box-head">
          <div className="flex dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <form>
          <div className="box-model">
            <p>Seems the page you’re looking for isn’t here.{'(>_<)'}</p>
            <div className="mt-auto">
              <Link href="/">
                <button className="btn">Reboot</button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
