import React from 'react'
import SupportMenu from './SupportMenu'

interface AboutMenuProps {
  data: any
}

const AboutMenu = ({ data }: AboutMenuProps) => {
  return (
    <div className="mega-menu about-menu">
      <div className="menu-description">
        <div className="mega-menu-content-box">
          <div dangerouslySetInnerHTML={{ __html: data?.about }} />
          <SupportMenu data={data?.support} />
        </div>
      </div>
    </div>
  )
}

export default AboutMenu
