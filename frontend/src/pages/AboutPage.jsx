import React from 'react'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import PageTransition from '../components/shared/PageTransition'
import ScrollReveal from '../components/shared/ScrollReveal'
import { Upload, Brain, Sparkles, CheckCircle, Users, Target, Lightbulb, AlertTriangle } from 'lucide-react'

const steps = [
  {
    step: '1',
    icon: <Upload size={24} />,
    title: 'Upload Foto',
    desc: 'Unggah foto wajah Anda dengan kualitas yang jelas untuk analisis optimal.',
  },
  {
    step: '2',
    icon: <Brain size={24} />,
    title: 'Analisis AI',
    desc: 'Sistem AI kami akan mendeteksi dan menganalisis area jerawat pada wajah Anda.',
  },
  {
    step: '3',
    icon: <Sparkles size={24} />,
    title: 'Hasil Deteksi',
    desc: 'Dapatkan informasi detail tentang jenis dan tingkat keparahan jerawat.',
  },
  {
    step: '4',
    icon: <CheckCircle size={24} />,
    title: 'Rekomendasi',
    desc: 'Dapatkan rekomendasi skincare yang sesuai dengan kondisi kulit Anda.',
  },
]

const teamMembers = [
  {
    role: 'Full-Stack Developer',
    desc: 'Mengembangkan aplikasi web dengan teknologi terbaru.',
  },
  {
    role: 'Data Scientist',
    desc: 'Membangun dan mengoptimalkan model AI untuk deteksi acne.',
  },
  {
    role: 'AI Engineer',
    desc: 'Merancang sistem machine learning yang akurat dan efisien.',
  },
]

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom, #3c8b89, #2a6360 120px, #f0f7f7 120px)' }}>
      <Navbar />
      <PageTransition>
        <div className="flex justify-center px-4 py-12">
          <div style={{ width: '80%', maxWidth: '950px' }}>
            <div className="bg-white rounded-2xl border border-yellow shadow-sm p-6 space-y-8">
              
              {/* Hero */}
              <ScrollReveal>
                <div className="text-center py-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-yellow mb-3">About Acne Detect</h1>
                  <p className="text-white/85 text-sm md:text-base max-w-2xl mx-auto">
                    Platform deteksi acne cerdas yang membantu pengguna mengidentifikasi tingkat keparahan acne 
                    dan mendapatkan rekomendasi skincare yang tepat.
                  </p>
                </div>
              </ScrollReveal>

              {/* Why We Built This */}
              <ScrollReveal delay={100}>
                <div className="bg-white rounded-2xl border border-yellow p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <h2 className="text-section-title md:text-xl font-semibold text-text mb-4">Mengapa Kami Membangun Ini</h2>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Acne merupakan masalah kulit yang sangat umum dan dapat mempengaruhi kepercayaan diri seseorang. 
                    Banyak orang kesulitan mengidentifikasi jenis acne dan memilih produk skincare yang tepat. 
                    Kami membangun platform ini untuk membantu pengguna memahami kondisi kulit mereka dengan lebih baik 
                    melalui teknologi AI yang akurat dan mudah digunakan.
                  </p>
                </div>
              </ScrollReveal>

              {/* Our Solution */}
              <ScrollReveal delay={200}>
                <div className="bg-white rounded-2xl border border-yellow p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <h2 className="text-section-title md:text-xl font-semibold text-text mb-4">Solusi Kami</h2>
                  <p className="text-text-muted text-sm leading-relaxed">
                    AcneDetect menggunakan model AI terkini untuk mendeteksi dan menganalisis acne pada wajah pengguna. 
                    Dengan mengunggah foto wajah, pengguna akan mendapatkan informasi detail tentang jumlah acne, 
                    area yang terdampak, tingkat keparahan, dan rekomendasi produk skincare yang sesuai dengan jenis kulit mereka.
                  </p>
                </div>
              </ScrollReveal>

              {/* How It Works */}
              <ScrollReveal delay={300}>
                <div className="bg-white rounded-2xl border border-yellow p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <h2 className="text-section-title md:text-xl font-semibold text-text mb-6">Cara Kerja</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((s, i) => (
                      <div key={i} className="text-center">
                        <div className="w-12 h-12 bg-teal rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-300">
                          <span className="text-white font-bold">{s.step}</span>
                        </div>
                        <div className="w-10 h-10 bg-teal-xlight rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-teal group-hover:text-white transition-all duration-300">
                          <span className="text-teal group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            {s.icon}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-text mb-2">{s.title}</h3>
                        <p className="text-text-muted text-xs leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Our Team */}
              <ScrollReveal delay={400}>
                <div className="bg-white rounded-2xl border border-yellow p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <h2 className="text-section-title md:text-xl font-semibold text-text mb-6">Tim Kami</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {teamMembers.map((member, i) => (
                      <div key={i} className="text-center p-4 bg-bg rounded-xl">
                        <div className="w-12 h-12 bg-teal-xlight rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-300">
                          <Users size={24} className="text-teal group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                        </div>
                        <h3 className="text-sm font-semibold text-text mb-2">{member.role}</h3>
                        <p className="text-text-muted text-xs leading-relaxed">{member.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Our Vision */}
              <ScrollReveal delay={500}>
                <div className="bg-white rounded-2xl border border-yellow p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <h2 className="text-section-title md:text-xl font-semibold text-text mb-4">Visi Kami</h2>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Kami ingin menjadi platform perawatan kulit terpercaya yang membantu jutaan orang 
                    di seluruh dunia untuk memahami dan mengatasi masalah acne mereka dengan lebih efektif. 
                    Dengan terus berkembangnya teknologi AI, kami berkomitmen untuk memberikan solusi 
                    yang semakin akurat dan personal bagi setiap pengguna.
                  </p>
                </div>
              </ScrollReveal>

              {/* Disclaimer */}
              <ScrollReveal delay={600}>
                <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={24} className="text-amber-500 shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-amber-800 mb-2">Peringatan</h3>
                      <p className="text-amber-700 text-xs leading-relaxed">
                        Hasil deteksi yang diberikan oleh sistem ini hanya bersifat rekomendasi awal dan tidak dapat 
                        menggantikan konsultasi dengan dokter kulit atau ahli dermatologi. Jika Anda memiliki 
                        masalah kulit yang serius, kami sangat menganjurkan Anda untuk berkonsultasi 
                        dengan profesional medis. Penggunaan produk skincare harus sesuai dengan jenis kulit 
                        Anda dan disarankan untuk melakukan tes tempel terlebih dahulu.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  )
}

export default AboutPage
