import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Calendar, Image as ImageIcon } from 'lucide-react'
import SeverityBadge from '../result/SeverityBadge'
import DeleteHistoryModal from './DeleteHistoryModal'

const HistoryCard = ({ item, onDelete }) => {
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)
  const [imgError, setImgError] = useState(false)

  const formattedDate = new Date(item.date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const fullImageUrl =
    item.imageUrl?.startsWith('http') || item.imageUrl?.startsWith('data:')
      ? item.imageUrl
      : `${BASE_URL}${item.imageUrl}`

  const levelLabel = item.acneLabel || item.severity || 'Hasil Deteksi'
  const skinType = item.skinType || item.jenis_kulit || '-'

  return (
    <>
      <div
        onClick={() => navigate(`/history/${item.id}`)}
        className="group card-yellow p-4 shadow-sm flex gap-4 items-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
          {!imgError ? (
            <img
              src={fullImageUrl}
              alt="Riwayat deteksi"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <ImageIcon size={24} className="text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <SeverityBadge severity={item.severity || item.acneLabel} />

            <span className="text-text-muted text-tiny flex items-center gap-1">
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>

          <p className="text-text text-sm font-semibold truncate">
            {levelLabel}
          </p>

          <p className="text-text-muted text-xs mt-1">
            Jenis kulit: {skinType}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowDelete(true)
          }}
          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all duration-200 hover:rotate-12 hover:scale-110 shrink-0"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {showDelete && (
        <DeleteHistoryModal
          onClose={() => setShowDelete(false)}
          onConfirm={() => {
            onDelete(item.id)
            setShowDelete(false)
          }}
        />
      )}
    </>
  )
}

export default HistoryCard