import React from 'react'
import { Target, MapPin, TrendingUp } from 'lucide-react'

const AcneSummary = ({ acneCount, areas, accuracy = 94 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-5 text-center shadow-sm group hover:shadow-md transition-all duration-300">
        <div className="w-10 h-10 bg-teal-xlight rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-teal transition-all duration-300">
          <Target size={20} className="text-teal group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
        </div>
        <p className="text-2xl font-bold text-text">{acneCount}</p>
        <p className="text-text-muted text-xs">Total Jerawat</p>
      </div>
      <div className="bg-white rounded-xl p-5 text-center shadow-sm group hover:shadow-md transition-all duration-300">
        <div className="w-10 h-10 bg-teal-xlight rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-teal transition-all duration-300">
          <MapPin size={20} className="text-teal group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
        </div>
        <div className="flex flex-wrap gap-1 justify-center mb-1">
          {areas.map((area) => (
            <span key={area} className="bg-teal-xlight text-teal-dark text-tiny px-2 py-0.5 rounded-full">
              {area}
            </span>
          ))}
        </div>
        <p className="text-text-muted text-xs">Area Terdampak</p>
      </div>
      <div className="bg-white rounded-xl p-5 text-center shadow-sm group hover:shadow-md transition-all duration-300">
        <div className="w-10 h-10 bg-teal-xlight rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-teal transition-all duration-300">
          <TrendingUp size={20} className="text-teal group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
        </div>
        <p className="text-2xl font-bold text-text">{accuracy}%</p>
        <p className="text-text-muted text-xs">Akurasi AI</p>
      </div>
    </div>
  )
}

export default AcneSummary

