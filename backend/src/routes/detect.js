const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const upload = require('../middleware/upload')
const { detect } = require('../controllers/detectController')

// POST /api/detect — requires auth + single image upload
router.post('/', authMiddleware, upload.single('image'), detect)

module.exports = router
