const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import the cors package
const app = express();

// Enable CORS for your website
const corsOptions = {
    origin: 'https://sylphx.site', // Replace with your actual frontend domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions)); // Enable CORS with the specified options

app.use(bodyParser.json()); // Parse JSON bodies

let validKeys = {}; // Temporary storage for valid keys

// Endpoint to handle both generating and redeeming keys
app.post('/key', (req, res) => {
    const { action, key } = req.body;

    if (action === 'generate') {
        if (!key || !key.startsWith('sylphx1day-')) {
            return res.status(400).json({ message: 'Invalid key format' });
        }

        validKeys[key] = true; // Store the key in memory
        console.log(`Key stored: ${key}`);
        return res.json({ message: 'Key generated and stored successfully' });
    }

    if (action === 'redeem') {
        if (validKeys[key]) {
            delete validKeys[key]; // Remove the key after redemption
            console.log(`Key redeemed: ${key}`);
            return res.json({ valid: true });
        } else {
            console.log(`Invalid key attempt: ${key}`);
            return res.json({ valid: false });
        }
    }

    return res.status(400).json({ message: 'Invalid action' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
