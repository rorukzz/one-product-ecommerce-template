const express = require('express');
const stripe = require('stripe')('sk_test_51OlKbKH26IvmDoLF5Bp8B82qlN4xnmsVpw5vJqtvh60Tek57Ee7njoxD0XCxn2xi85BMhsVsQZlcTc5LsKT9rWfY003iw1DwMs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/create-charge', async (req, res) => {
    try {
        const { token, amount } = req.body;

        const charge = await stripe.charges.create({
            amount: amount,
            currency: 'aud',
            source: token,
            description: 'Tech Product Purchase',
        });

        res.json({ success: true, charge });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
