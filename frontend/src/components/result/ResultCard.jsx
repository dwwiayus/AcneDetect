import React, { useMemo } from 'react'
import SeverityBadge from './SeverityBadge'

const ResultCard = ({ imageUrl, severity, acneCount, areas }) => {
  const positions = useMemo(() => {
    return areas.map(() => ({
      top: `${30 + Math.random() * 40}%`,
      left: `${20 + Math.random() * 60}%`,
    }))
  }, [areas])

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="relative">
        <img src={imageUrl} alt="Hasil deteksi" className="w-full h-64 object-cover" />
        <div className="absolute top-4 right-4">
          <SeverityBadge severity={severity} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {areas.map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-red-500 rounded-full animate-pulse"
              style={positions[i]}
            />
          ))}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-sm font-semibold text-text mb-1">Hasil Deteksi</h3>
        <p className="text-text-muted text-xs">
          Ditemukan <span className="font-semibold text-teal">{acneCount}</span> jerawat pada{' '}
          <span className="font-semibold text-teal">{areas.join(', ')}</span>
        </p>
      </div>
    </div>
  )
}

export default ResultCard

