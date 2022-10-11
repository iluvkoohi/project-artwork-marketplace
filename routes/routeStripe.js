require("dotenv").config();
const express = require("express");
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);

router.post("/stripe", async (req, res) => {
    try {
        const { name, image, amount } = req.body;

        const items = [
            {
                price_data: {
                    currency: 'php',
                    product_data: {
                        name,
                        images: [image]
                    },
                    unit_amount: parseInt(amount + '00')
                },
                quantity: 1
            }
        ]
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items,
            mode: 'payment',
            success_url: `${process.env.DOMAIN_URL}/checkout/success`,
            cancel_url: `${process.env.DOMAIN_URL}/checkout/error`
        })
        return res.status(200).json({ "url": session.url });
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;