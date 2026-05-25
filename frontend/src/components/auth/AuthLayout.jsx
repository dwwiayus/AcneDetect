import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          'linear-gradient(135deg, #2c6d68 0%, #3b9892 50%, #27605c 100%)',
      }}
    >
      <div
        className="
          relative overflow-hidden
          w-full max-w-[400px]
          bg-white
          rounded-[22px]
          border border-[#efe56f]
          shadow-2xl
          px-9 py-10
        "
      >
        <div
          className="
            absolute right-0 bottom-0
            w-[90px] h-[90px]
            bg-[#f2ec80]
            [clip-path:polygon(100%_0,100%_100%,0_100%)]
          "
        />

        <div className="relative z-10">{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout