const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkoutSchema = new Schema({
    user: {
        name: String,
        email: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        phone: Number,
    },
    products: [{
        productId: String,
        name: String,
        images: [String],
        price: Number,
        quantity: Number,
    }],
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending', 'failed'], // Add all valid statuses here
        required: true,
    },
    userId:String,
    orderStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], // Add all valid statuses here
        required: true,
    },
    sessionId: {
        type: String,
        required: true,
    }
},{
    timestamps : true
});

const Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;
