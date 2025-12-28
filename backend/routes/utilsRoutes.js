const express = require('express');
const router = express.Router();
const { getPincodeDetails } = require('../controllers/utilsController');

router.get('/pincode/:pincode', getPincodeDetails);

module.exports = router;
