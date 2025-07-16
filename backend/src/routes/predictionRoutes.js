import express from 'express';
import axios from 'axios';

const router = express.Router();

// The base URL for your Python ML service
const ML_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://mlservice-i6if.onrender.com'
  : 'http://mlservice:8000'; // Use http://localhost:8000 for non-docker development

/**
 * @route   GET /api/predict/:ticker
 * @description    Get a stock prediction from the Python ML service
 * @access  Public (no authentication required)
 */
router.get('/:ticker', async (req, res) => { // run when gotten a request to /api/predict/:ticker
  try {
    const ticker = req.params.ticker;

    // Call the Python API
    const response = await axios.get(`${ML_API_URL}/predict/${ticker}`);

    // Forward the response from the Python API to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error calling ML service:', error.message);
    
    // Forward the error status and message if available, otherwise send a generic 500 error
    if (error.response) {
      res.status(error.response.status).json({ message: error.response.data.detail });
    } else {
      res.status(500).json({ message: 'Error communicating with the prediction service' });
    }
  }
});

export default router;