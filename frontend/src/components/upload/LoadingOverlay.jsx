import React from 'react'
import Skeleton from 'react-loading-skeleton'

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
        <Skeleton circle height={80} width={80} className="mx-auto mb-4" />
        <h3 className="text-sm font-semibold text-text mb-1">Mendeteksi area jerawat...</h3>
        <p className="text-text-muted text-xs">Mohon tunggu sebentar</p>
      </div>
    </div>
  )
}

export default LoadingOverlay

