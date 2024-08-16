import React from 'react'

interface SupportMenuProps {
  data: any
}

const SupportMenu = ({ data }: SupportMenuProps) => {
  return <div dangerouslySetInnerHTML={{ __html: data }} />
}

export default SupportMenu
