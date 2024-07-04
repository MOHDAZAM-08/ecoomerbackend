const stripe = require('stripe')(process.env.STRIPE_SECRET);

const createCheckoutSession = async (req, res) => {
    try {
        const { products, ...userData } = req.body;
        // console.log("userdata", userData);

        const lineItems = products.map(product => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: product.name,
                    // images: [product.imgdata],
                },
                unit_amount: product.price * 100,
            },
            quantity: product.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:3000/cancel",
            customer_email: userData.email,
            shipping_address_collection: {
                allowed_countries: ['IN', 'US', 'CA'],
            },
            metadata: {
                customerName: userData.name,
                address: userData.address,
                city: userData.city,
                state: userData.state,
                pincode: userData.pincode,
                phone: userData.phone,
                products: JSON.stringify(products) // Storing products in metadata
            },
        });

        res.json({ id: session.id });

    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({
            error: error.message || "Error from backend",
            success: false
        });
    }
};

module.exports = createCheckoutSession;


