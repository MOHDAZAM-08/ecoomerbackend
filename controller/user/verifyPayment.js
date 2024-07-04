const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Checkout = require('../../models/checkoutModel');
const User = require('../../models/userModel');
const Product = require('../../models/productModel'); // Import the product model

const verifyPayment = async (req, res) => {
    const { sessionId, userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true
            });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // console.log("meta",session.metadata.phone);

        if (session.payment_status === 'paid') {
            const userData = {
                name: user.name,
                email: user.email,
                address: session.metadata.address,
                city: session.metadata.city,
                state: session.metadata.state,
                pincode: session.metadata.pincode,
                phone: session.metadata.phone,
            };

            const products = JSON.parse(session.metadata.products);

            const updatedProducts = await Promise.all(products.map(async (product) => {
                const updatedProduct = await Product.findById(product.productId);
                if (updatedProduct) {
                    const firstImage = updatedProduct.productImage[0];
                    return { ...product, imgdata: firstImage };
                }
                return product;
            }));
            
            // Create a new checkout document
            const checkout = new Checkout({
                user: userData,
                products: updatedProducts.map(product => ({
                    productId: product.productId,
                    name: product.name, 
                    images: product.imgdata, // Use the imgdata field from the updatedProducts array
                    price: product.price, 
                    quantity: product.quantity,
                })),
                userId: user._id,
                paymentStatus: 'paid',
                orderStatus: 'Processing',
                sessionId: session.id,
            });
            
            // Save the checkout document or handle it as needed
            await checkout.save();
            
            // console.log(checkout);
            

            // Save the checkout document to the database
            await checkout.save();

            // Update product quantities
            await Promise.all(products.map(async (product) => {
                const updatedProduct = await Product.findById(product.productId);
                if (updatedProduct) {
                    updatedProduct.Stock -= product.quantity;
                    await updatedProduct.save();
                }
            }));

            res.json({
                message: "Payment successful and order confirmed",
                success: true,
                error: false
            });
        } else {
            res.json({
                message: "Payment not successful",
                success: false,
                error: true
            });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            message: "Error verifying payment",
            success: false,
            error: true
        });
    }
};

module.exports = verifyPayment;
