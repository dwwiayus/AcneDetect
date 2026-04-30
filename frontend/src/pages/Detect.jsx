import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, X, Loader2, AlertCircle, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Detect({ isLoggedIn, username, onLogout }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  });

  const removeImage = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
  };

  const handleDetect = async () => {
    if (!file) {
      setError('Silakan pilih gambar terlebih dahulu');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'multipart/form-data' };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.post('/detect', formData, { headers });
      
      if (response.data) {
        toast.success('Deteksi berhasil!');
        navigate('/result', { 
          state: { 
            detection: response.data,
            isLoggedIn: !!token
          }
        });
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Deteksi gagal';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={onLogout} />
      
      <div className="container mx-auto max-w-2xl py-8 px-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Kembali
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Analisis Jerawat
          </h1>
          <p className="text-gray-500 mt-2">Upload foto area kulit yang ingin dianalisis</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm px-4 py-2 rounded-full">
            💡 Gratis! Tidak perlu login untuk analisis
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
          {!preview ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'}`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600">
                {isDragActive ? 'Lepaskan gambar di sini' : 'Seret & lepas gambar di sini'}
              </p>
              <p className="text-gray-400 text-sm mt-2">atau klik untuk memilih file</p>
              <p className="text-gray-400 text-xs mt-4">Format: JPG, PNG (Maks 5MB)</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-gray-100">
                <img src={preview} alt="Preview" className="w-full max-h-96 object-contain" />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleDetect}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Analisis Sekarang
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <h3 className="font-semibold text-gray-800 mb-2">💡 Tips Hasil Terbaik</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Gunakan pencahayaan alami yang cukup</li>
            <li>• Foto area jerawat dengan fokus jelas</li>
            <li>• Hindari makeup atau filter kamera</li>
            <li>• Wajah dalam keadaan bersih</li>
          </ul>
        </div>
      </div>
    </div>
  );
}