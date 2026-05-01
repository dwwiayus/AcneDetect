import React from 'react'
import { Upload, Brain, Sparkles } from 'lucide-react'
import ScrollReveal from '../shared/ScrollReveal'

const steps = [
  {
    icon: <Upload size={28} />,
    title: 'Upload Foto',
    desc: 'Unggah foto wajah Anda dengan kualitas yang jelas untuk analisis optimal.',
  },
  {
    icon: <Brain size={28} />,
    title: 'Analisis AI',
    desc: 'Sistem AI kami akan mendeteksi dan menganalisis area jerawat pada wajah Anda.',
  },
  {
    icon: <Sparkles size={28} />,
    title: 'Rekomendasi',
    desc: 'Dapatkan rekomendasi skincare yang sesuai dengan kondisi kulit Anda.',
  },
]

const HowItWorksSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-[#f0f7f7] to-[#e4f2f2]">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-section-title md:text-2xl font-semibold text-text text-center mb-10">
            Cara Kerja
          </h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <div className="w-14 h-14 bg-teal-xlight rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-teal group-hover:text-white transition-all duration-300">
                  <span className="text-teal group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {step.icon}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-text mb-2">{step.title}</h3>
                <p className="text-text-muted text-xs leading-relaxed">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
