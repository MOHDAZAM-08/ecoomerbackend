const Checkout = require("../../models/checkoutModel");

async function updateOrderStatus(req, res) {
    try {
        // Extract order details from the request body
        const { orderId, status } = req.body;

        // console.log("Received orderId:", orderId); // Log orderId for debugging
        // console.log("Received status:", status); // Log status for debugging

        // Find the order by its ID and update its status
        const updatedOrder = await Checkout.findByIdAndUpdate(
            orderId,
            { orderStatus: status },
            { new: true }
        );

        // Check if the order was found and updated
        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
                error: true
            });
        }

        // Respond with the updated order details
        res.json({
            data: updatedOrder,
            message: "Order status updated",
            success: true,
            error: false
        });
    } catch (err) {
        // Handle errors and send error response
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = updateOrderStatus;
