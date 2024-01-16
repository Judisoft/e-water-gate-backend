const express = require('express');
const router = express.Router();

 const {postContact} = require('../controllers/ContactController')

router.post('/contact', postContact);

module.exports = router;