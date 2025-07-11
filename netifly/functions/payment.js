// This file should be placed in a 'netlify/functions' directory in your project.
// Example: your-project-folder/netlify/functions/create-payment-intent.js

// IMPORTANT: You must install the Stripe Node.js library for this to work.
// In your project's root directory, run: npm install stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// A simple map to hold product prices. In a real app, you'd fetch this from a database.
// The keys MUST match the data-id attributes in your products.html
const productPrices = {
    "price_1...": 499, // Florida Fire - $4.99 (in cents)
    "price_1...": 499, // Florida Heat - $4.99 (in cents)
    "price_1...": 499, // Florida Heat Green - $4.99 (in cents)
};

const calculateOrderAmount = (items) => {
    let total = 0;
    items.forEach(item => {
        const price = productPrices[item.id];
        if (price) {
            total += price * item.quantity;
        }
    });
    // For this example, add a flat $5 shipping fee
    total += 500; 
    return total;
};

exports.handler = async (event) => {
    // We only care about POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { items } = JSON.parse(event.body);
        const amount = calculateOrderAmount(items);

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
        };
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create payment intent.' }),
        };
    }
};
