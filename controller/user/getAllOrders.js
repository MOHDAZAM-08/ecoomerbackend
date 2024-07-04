const Checkout = require("../../models/checkoutModel");

const getAllOrders = async (req, res) => {
    try {
        const orders = await Checkout.find({});
        // console.log("Orders:", orders); // Log orders for debugging

        // Optionally, sort the orders by their creation date in descending order
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(orders);
    } catch (error) {
        // console.error("Error fetching orders:", error); // Log error for debugging
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

module.exports = getAllOrders;
