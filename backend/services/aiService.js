const sharp = require('sharp');

// Definisi kelas jerawat dan tingkat keparahan
const ACNE_TYPES = ['Comedonal', 'Inflammatory', 'Cystic', 'Hormonal'];
const SEVERITY_LEVELS = ['Mild', 'Moderate', 'Severe'];

// Rekomendasi mapping
const getRecommendationsByTypeAndSeverity = (acneType, severity) => {
  const recommendations = {
    Comedonal: {
      Mild: [
        'Gunakan salicylic acid 2% secara rutin',
        'Double cleansing untuk membersihkan pori-pori',
        'Hindari produk komedogenik'
      ],
      Moderate: [
        'Kombinasikan salicylic acid dengan niacinamide',
        'Chemical exfoliation 2-3x seminggu',
        'Gunakan clay mask 1x seminggu'
      ],
      Severe: [
        'Konsultasi ke dermatologis',
        'Retinoid topical (mulai dosis rendah)',
        'Benzoyl peroxide spot treatment'
      ]
    },
    Inflammatory: {
      Mild: [
        'Niacinamide untuk mengurangi peradangan',
        'Centella asiatica untuk menenangkan kulit',
        'Hindari memencet jerawat'
      ],
      Moderate: [
        'Azelaic acid untuk anti-inflamasi',
        'Tea tree oil spot treatment',
        'Gunakan pelembab yang menenangkan'
      ],
      Severe: [
        'Konsultasi ke dermatologis untuk antibiotik topical',
        'Benzoyl peroxide 5%',
        'Ice compress untuk mengurangi bengkak'
      ]
    },
    Cystic: {
      Mild: [
        'Retinol untuk mencegah penyumbatan',
        'Jaga kebersihan wajah',
        'Hindari makanan tinggi gula'
      ],
      Moderate: [
        'Kombinasi retinol + benzoyl peroxide',
        'Konsultasi ke dokter kulit',
        'Ice compress untuk mengurangi nyeri'
      ],
      Severe: [
        'SEGERA konsultasi ke dermatologis',
        'Butuh penanganan medis (kortikosteroid)',
        'Jangan pernah memencet jerawat kistik'
      ]
    },
    Hormonal: {
      Mild: [
        'Gunakan produk dengan azelaic acid',
        'Kontrol stres dan pola tidur',
        'Hindari dairy jika sensitif'
      ],
      Moderate: [
        'Spearmint tea untuk menyeimbangkan hormon',
        'Kombinasi niacinamide + zinc',
        'Konsultasi ke dokter kandungan'
      ],
      Severe: [
        'Konsultasi ke dermatologis dan endokrinolog',
        'Mungkin butuh terapi hormonal',
        'Treatment kombinasi topical + oral'
      ]
    }
  };
  
  return recommendations[acneType]?.[severity] || [
    'Rutin membersihkan wajah 2x sehari',
    'Gunakan skincare sesuai jenis kulit',
    'Konsultasi ke dermatologis jika perlu'
  ];
};

// Mock AI Prediction (tanpa TensorFlow)
const predictAcne = async (imageBuffer) => {
  // Simulasi pemrosesan gambar (opsional)
  try {
    await sharp(imageBuffer).resize(224, 224).toBuffer();
  } catch (e) {
    // Abaikan error sharp
  }
  
  // Simulasi prediksi dengan random yang realistis
  const acneTypeIndex = Math.floor(Math.random() * ACNE_TYPES.length);
  const severityIndex = Math.floor(Math.random() * SEVERITY_LEVELS.length);
  
  const acneType = ACNE_TYPES[acneTypeIndex];
  const severity = SEVERITY_LEVELS[severityIndex];
  
  // Simulasi confidence score (antara 70% - 95%)
  const confidence = 0.7 + (Math.random() * 0.25);
  
  // Dapatkan rekomendasi berdasarkan hasil
  const tips = getRecommendationsByTypeAndSeverity(acneType, severity);
  
  return {
    acneType,
    severity,
    confidence: parseFloat(confidence.toFixed(2)),
    allTypes: ACNE_TYPES.reduce((acc, type, idx) => {
      acc[type] = idx === acneTypeIndex ? confidence : Math.random() * 0.3;
      return acc;
    }, {}),
    allSeverities: SEVERITY_LEVELS.reduce((acc, sev, idx) => {
      acc[sev] = idx === severityIndex ? confidence : Math.random() * 0.3;
      return acc;
    }, {}),
    tips
  };
};

module.exports = { predictAcne, ACNE_TYPES, SEVERITY_LEVELS };