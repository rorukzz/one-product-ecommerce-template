const express = require('express');
const stripe = require('stripe')('sk_test_51OlKbKH26IvmDoLF5Bp8B82qlN4xnmsVpw5vJqtvh60Tek57Ee7njoxD0XCxn2xi85BMhsVsQZlcTc5LsKT9rWfY003iw1DwMs');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Connect to your MongoDB database
mongoose.connect('mongodb+srv://admin:P@ssword1@cluster0.zw7yheo.mongodb.net/yourDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const orderSchema = new mongoose.Schema({
    chargeId: String,
    amount: Number,
    shippingInfo: Object,
    productName: String,
    status: String
});

const Order = mongoose.model('Order', orderSchema);

app.post('/create-charge', async (req, res) => {
    try {
        const { token, amount, shippingInfo } = req.body;

        const charge = await stripe.charges.create({
            amount: amount,
            currency: 'aud',
            source: token,
            description: 'Tech Product Purchase',
            metadata: {
                name: shippingInfo.name,
                email: shippingInfo.email,
                street: shippingInfo.street,
                suburb: shippingInfo.suburb,
                city: shippingInfo.city,
                postal_code: shippingInfo.postal_code,
                product: shippingInfo.productName // Include product name in metadata
            }
        });

        const order = new Order({
            chargeId: charge.id,
            amount: charge.amount,
            shippingInfo: shippingInfo,
            productName: shippingInfo.productName,
            status: 'Pending'
        });
        await order.save();

        res.json({ success: true, charge });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});