const express = require('express');
const path = require("path");
const stripe = require('stripe')('sk_test_51OPrrJJk6SoY8iObfEBw4hkH5ueFu4WMZ4VZ7OgTVrTsgPqCwrHDQ4smjYmDc6J84VKdlKx24eQNKGUHTtvq8wne00FPNUqwog');


const app = express();
const port = 3000;

app.use(express.json());

// Define a route for processing payments
app.post('/process-payment', async (req, res) => {
    const { amount, currency, token } = req.body;

    try {
        // Create a payment intent using the Stripe API
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: token,
            confirm: true,
        });

        // Return the payment intent status to the client
        res.json({ status: paymentIntent.status });

    } catch (error) {
        console.error('Error processing payment:', error); // Log the error
        res.status(500).json({ error: 'An error occurred while processing the payment.' });
    }
});



app.get('/pay', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'payform.html'));
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
