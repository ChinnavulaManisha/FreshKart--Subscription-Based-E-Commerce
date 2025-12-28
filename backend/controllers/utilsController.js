const asyncHandler = require('express-async-handler');
const axios = require('axios');

// @desc    Get City/State from Pincode (Proxy)
// @route   GET /api/utils/pincode/:pincode
// @access  Public
const getPincodeDetails = asyncHandler(async (req, res) => {
    const pincode = req.params.pincode;

    try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);

        if (response.data && response.data[0].Status === 'Success') {
            res.json(response.data[0].PostOffice[0]);
        } else {
            res.status(404);
            throw new Error('Invalid Pincode');
        }
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch pincode details');
    }
});

module.exports = {
    getPincodeDetails
};
