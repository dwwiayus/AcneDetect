import React from 'react'
import SeverityBadge from './SeverityBadge'

const ResultCard = ({ imageUrl, severity, acneCount, areas }) => {
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  
  let fullImageUrl = imageUrl
  if (imageUrl && !imageUrl.startsWith('http')) {
    fullImageUrl = `${BASE_URL}${imageUrl}`
  }
  
  console.log('Original imageUrl:', imageUrl)
  console.log('Full imageUrl:', fullImageUrl)

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="relative">
        <img 
          src={fullImageUrl} 
          alt="Hasil deteksi" 
          className="w-full h-64 object-cover"
          onError={(e) => {
            console.error('Gambar gagal dimuat:', fullImageUrl)
            e.target.src = 'https://via.placeholder.com/400x300?text=Gambar+Tidak+Tersedia'
          }}
          onLoad={() => console.log('Gambar berhasil dimuat:', fullImageUrl)}
        />
        <div className="absolute top-4 right-4">
          <SeverityBadge severity={severity} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {areas && areas.map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-red-500 rounded-full animate-pulse"
              style={{
                top: `${30 + Math.random() * 40}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-sm font-semibold text-text mb-1">Hasil Deteksi</h3>
        <p className="text-text-muted text-xs">
          Ditemukan <span className="font-semibold text-teal">{acneCount || 0}</span> jerawat pada{' '}
          <span className="font-semibold text-teal">{areas?.join(', ') || '-'}</span>
        </p>
      </div>
    </div>
  )
}

export default ResultCard