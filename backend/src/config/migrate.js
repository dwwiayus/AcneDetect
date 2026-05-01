const pool = require('./db')

const createTables = async () => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Detection history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS detection_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        acne_count INTEGER NOT NULL DEFAULT 0,
        severity VARCHAR(20) NOT NULL CHECK (severity IN ('Mild', 'Moderate', 'Severe')),
        areas TEXT[] NOT NULL DEFAULT '{}',
        accuracy NUMERIC(5,2) DEFAULT 94.0,
        products JSONB DEFAULT '[]',
        detections JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Products table (catalog)
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        ingredients TEXT,
        usage_instruction TEXT,
        rating NUMERIC(3,1) DEFAULT 4.0,
        image_url TEXT,
        for_severity TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_us (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
       )
     `)

    await client.query('COMMIT')
    console.log('✅ Database tables created successfully')

    // Seed sample products
    await seedProducts(client)
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Migration failed:', err)
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

const seedProducts = async (client) => {
  const { rows } = await client.query('SELECT COUNT(*) FROM products')
  if (parseInt(rows[0].count) > 0) {
    console.log('ℹ️  Products already seeded')
    return
  }

  const products = [
    {
      name: 'Salicylic Acid Cleanser',
      description: 'Pembersih wajah dengan asam salisilat untuk membuka pori-pori tersumbat',
      category: 'Cleanser',
      ingredients: 'Salicylic Acid 2%, Glycerin, Niacinamide',
      usage: 'Gunakan 2x sehari, pagi dan malam',
      rating: 4.5,
      severity: ['Mild', 'Moderate', 'Severe'],
    },
    {
      name: 'Niacinamide Serum 10%',
      description: 'Serum untuk mengurangi kemerahan dan memperkecil pori-pori',
      category: 'Serum',
      ingredients: 'Niacinamide 10%, Zinc PCA 1%',
      usage: 'Gunakan di pagi dan malam hari setelah toner',
      rating: 4.7,
      severity: ['Mild', 'Moderate'],
    },
    {
      name: 'Benzoyl Peroxide Gel 5%',
      description: 'Gel antibakteri untuk mengatasi jerawat aktif',
      category: 'Treatment',
      ingredients: 'Benzoyl Peroxide 5%, Carbomer',
      usage: 'Oleskan tipis pada area jerawat 1x sehari',
      rating: 4.3,
      severity: ['Moderate', 'Severe'],
    },
    {
      name: 'Oil-Free Moisturizer Gel',
      description: 'Pelembap ringan non-comedogenic untuk kulit berminyak',
      category: 'Moisturizer',
      ingredients: 'Hyaluronic Acid, Ceramide, Glycerin',
      usage: 'Gunakan setelah serum, pagi dan malam',
      rating: 4.6,
      severity: ['Mild', 'Moderate', 'Severe'],
    },
    {
      name: 'Mineral Sunscreen SPF 50',
      description: 'Tabir surya ringan dengan perlindungan tinggi',
      category: 'Sunscreen',
      ingredients: 'Zinc Oxide 12%, Titanium Dioxide 5%',
      usage: 'Gunakan 15 menit sebelum terpapar matahari',
      rating: 4.8,
      severity: ['Mild', 'Moderate', 'Severe'],
    },
    {
      name: 'Retinol Night Cream 0.5%',
      description: 'Krim malam untuk regenerasi kulit dan mengurangi bekas jerawat',
      category: 'Night Cream',
      ingredients: 'Retinol 0.5%, Peptide Complex, Vitamin E',
      usage: 'Gunakan 2-3x seminggu di malam hari',
      rating: 4.4,
      severity: ['Moderate', 'Severe'],
    },
    {
      name: 'AHA BHA Toner',
      description: 'Toner eksfoliasi lembut dengan AHA dan BHA',
      category: 'Toner',
      ingredients: 'Glycolic Acid 5%, Salicylic Acid 1%, Witch Hazel',
      usage: 'Gunakan kapas, usap lembut setelah cuci muka',
      rating: 4.2,
      severity: ['Mild', 'Moderate'],
    },
    {
      name: 'Spot Treatment Drying Lotion',
      description: 'Lotion untuk mengeringkan jerawat dengan cepat',
      category: 'Spot Treatment',
      ingredients: 'Sulfur 10%, Calamine, Zinc Oxide',
      usage: 'Oleskan langsung pada jerawat sebelum tidur',
      rating: 4.5,
      severity: ['Severe'],
    },
  ]

  for (const p of products) {
    await client.query(
      `INSERT INTO products (name, description, category, ingredients, usage_instruction, rating, for_severity)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [p.name, p.description, p.category, p.ingredients, p.usage, p.rating, p.severity]
    )
  }
  console.log('✅ Products seeded successfully')
}

createTables().catch(console.error)
