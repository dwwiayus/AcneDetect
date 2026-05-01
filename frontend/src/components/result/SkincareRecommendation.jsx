import React from 'react'
import ProductCard from './ProductCard'
import ScrollReveal from '../shared/ScrollReveal'

const SkincareRecommendation = ({ products }) => {
  return (
    <ScrollReveal>
      <div>
        <h3 className="text-section-title font-semibold text-text mb-4">Rekomendasi Skincare</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 80}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </ScrollReveal>
  )
}

export default SkincareRecommendation

