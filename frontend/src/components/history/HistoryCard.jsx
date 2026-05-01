import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Calendar } from 'lucide-react'
import SeverityBadge from '../result/SeverityBadge'
import DeleteHistoryModal from './DeleteHistoryModal'

const HistoryCard = ({ item, onDelete }) => {
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)

  const formattedDate = new Date(item.date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <div
        onClick={() => navigate(`/history/${item.id}`)}
        className="group bg-white rounded-xl p-4 shadow-sm flex gap-4 items-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <img
          src={item.imageUrl}
          alt="History"
          className="w-16 h-16 rounded-lg object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <SeverityBadge severity={item.severity} />
            <span className="text-text-muted text-tiny flex items-center gap-1">
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>
          <p className="text-text text-sm font-medium truncate">
            {item.acneCount} jerawat di {item.areas.join(', ')}
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

