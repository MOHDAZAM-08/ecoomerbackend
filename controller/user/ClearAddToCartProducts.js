const addToCartModel = require("../../models/cartProduct");

const ClearAddToCartProducts = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const productIds = req.body.productIds;

        // Ensure productIds is an array
        if (!Array.isArray(productIds)) {
            throw new Error('Product IDs must be provided as an array');
        }

        // Delete multiple products from the cart based on their IDs and the current user ID
        const deleteProducts = await addToCartModel.deleteMany({ 
            userId: currentUserId, // Match the user ID
            productId: { $in: productIds } // Match the product IDs
        });

        // Check if any products were deleted
        if (deleteProducts.deletedCount === 0) {
            res.status(404).json({
                message: "No products found in the cart with the provided IDs",
                error: true,
                success: false
            });
            return;
        }

        res.json({
            message: "Products cleared From Cart",
            error: false,
            success: true,
            data: deleteProducts
        });
    } catch (err) {
        res.status(500).json({
            message: err?.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = ClearAddToCartProducts;
