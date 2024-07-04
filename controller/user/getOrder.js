const Checkout = require("../../models/checkoutModel");

const getOrders = async (req, res) => {
    try {
        const userId = req?.params?.userID;
        // console.log("User ID:", userId); // Log user ID for debugging

        const orders = await Checkout.find({ 
            userId: userId,
            orderStatus: { $ne: 'Shipped' }
        });
        // console.log("Orders:", orders); // Log orders for debugging

        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error); // Log error for debugging
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

module.exports = getOrders;
