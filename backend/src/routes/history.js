const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { getHistory, getHistoryById, saveHistory, deleteHistory } = require('../controllers/historyController')

router.use(authMiddleware)

router.get('/', getHistory)
router.get('/:id', getHistoryById)
router.post('/', saveHistory)
router.delete('/:id', deleteHistory)

module.exports = router
