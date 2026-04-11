// backend/src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const reportController = require('../controllers/reportController');

const upload = multer({ dest: 'src/uploads/' }); // Pasta que aparece na sua imagem

router.post('/upload', upload.single('report'), reportController.uploadReport);

module.exports = router;