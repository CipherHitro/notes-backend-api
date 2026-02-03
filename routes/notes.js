const express = require('express')
const router = express.Router()
const { GetNotes , CreateNote, UpdateNote, SearchNote} = require('../controller/notes')
const rateLimiter = require('../middleware/rateLimiter')

// Apply rate limiter only to POST (create) route
router.post('/', rateLimiter, CreateNote)
router.get('/',GetNotes)
router.get('/search',SearchNote)
router.put('/:id', UpdateNote)
module.exports = router;