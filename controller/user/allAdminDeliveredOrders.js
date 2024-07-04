const AdminPermission = require("../../helpers/AdminPermission");
const Checkout = require("../../models/checkoutModel");

const allAdminDeliveredOrders = async (req, res) => {

    

    try {

        if(!AdminPermission(req.userId)){
            throw new Error("Permission denied")
        }

        const orders = await Checkout.find({ 
            // userId: userId,
            orderStatus: 'Delivered'
        });

        // orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

module.exports = allAdminDeliveredOrders;
