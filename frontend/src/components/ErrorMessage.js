import React from 'react'

function ErrorMessage(props) {
    const {error} = props
  return (
    <div role='alert' className='alert text-center'>{error}</div>
  )
}

export default ErrorMessage