import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema } from '../utils/validators'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import PageTransition from '../components/shared/PageTransition'
import { sendContactMessage } from '../utils/apiService'
import { Send, Mail, MapPin, Phone, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const ContactPage = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (data) => {
    await sendContactMessage(data)
    toast.success('Pesan berhasil dikirim!')
    reset()
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom, #3c8b89, #2a6360 120px, #f0f7f7 120px)' }}>
      <Navbar />
      <PageTransition>
        <div className="flex justify-center px-4 py-12 flex-1">
          <div style={{ width: '90%', maxWidth: '900px' }}>
            <div className="bg-white rounded-2xl border border-yellow shadow-sm p-6">
              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle size={48} className="text-teal mb-3" />
                  <h3 className="text-lg font-semibold text-text mb-2">Pesan Terkirim!</h3>
                  <p className="text-text-muted text-sm">Kami akan segera menghubungi Anda.</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-10">
                    <h1 className="text-section-title md:text-2xl font-semibold text-text mb-2">Hubungi Kami</h1>
                    <p className="text-text-muted text-xs">Punya pertanyaan? Kami siap membantu Anda.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 bg-teal-xlight rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-teal transition-all duration-300">
                          <Mail size={20} className="text-teal group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-text mb-1">Email</h3>
                          <p className="text-text-muted text-xs">support@acnedetect.id</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 bg-teal-xlight rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-teal transition-all duration-300">
                          <Phone size={20} className="text-teal group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-text mb-1">Telepon</h3>
                          <p className="text-text-muted text-xs">+62 812-3456-7890</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 bg-teal-xlight rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-teal transition-all duration-300">
                          <MapPin size={20} className="text-teal group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-text mb-1">Alamat</h3>
                          <p className="text-text-muted text-xs">Jl. Teknologi No. 123, Jakarta Selatan</p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-0">
                      <div className="mb-4">
                        <label className="block text-label font-medium text-text mb-1">Nama</label>
                        <input
                          {...register('name')}
                          disabled={isSubmitting}
                          className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition ${
                            errors.name ? 'border-red-400' : 'border-gray-200'
                          }`}
                          placeholder="Nama Anda"
                        />
                        {errors.name && <p className="text-red-500 text-tiny mt-1">{errors.name.message}</p>}
                      </div>
                      <div className="mb-4">
                        <label className="block text-label font-medium text-text mb-1">Email</label>
                        <input
                          {...register('email')}
                          disabled={isSubmitting}
                          className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition ${
                            errors.email ? 'border-red-400' : 'border-gray-200'
                          }`}
                          placeholder="email@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-tiny mt-1">{errors.email.message}</p>}
                      </div>
                      <div className="mb-4">
                        <label className="block text-label font-medium text-text mb-1">Pesan</label>
                        <textarea
                          {...register('message')}
                          disabled={isSubmitting}
                          rows={4}
                          className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition resize-none ${
                            errors.message ? 'border-red-400' : 'border-gray-200'
                          }`}
                          placeholder="Tulis pesan Anda..."
                        />
                        {errors.message && <p className="text-red-500 text-tiny mt-1">{errors.message.message}</p>}
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-teal text-white py-2.5 rounded-lg font-medium text-sm hover:bg-teal-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Mengirim...
                          </>
                        ) : (
                          <>
                            <Send size={16} /> Kirim Pesan
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  )
}

export default ContactPage
