import React from 'react'

type Props = {
  element: ElementType
}

const Elements = ({ element }: Props) => {
  return (
    <div className='px-2 py-1.5 rounded-md border cursor-pointer hover:border-gray-400 hover:bg-gradient-to-t hover:from-blue-500/20 hover:via-white hover:to-white'>
      {element.emoji} {element.name}
    </div>
  )
}


export default Elements