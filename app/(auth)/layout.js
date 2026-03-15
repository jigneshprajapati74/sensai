import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className="p-40 flex  justify-center">
      {children}
    </div>
  )
}

export default AuthLayout;