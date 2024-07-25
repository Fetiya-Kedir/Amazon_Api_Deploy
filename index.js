const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const app = express();
app.use(cors({ origin: true }));

app.use(express.json());
app.get('/', (req, res) => {
	res.status(200).json({
		message: 'Success!!',
	});
});

app.post('/payment/create', async (req, res) => {
	const total = req.query.total;
	if (total > 0) {
		// console.log('payment recieved', total);
		// res.send(total);
		const paymentIntent = await stripe.paymentIntents.create({
			amount: total,
			currency: 'usd',
		});
		console.log(paymentIntent);
		res.status(201).json({
			clientSecret: paymentIntent.client_secret,
		});
	} else {
		res.status(403).json({
			message: 'Invalid request',
		});
	}
});

app.listen(5000, (err) => {
	if (err) console.log(err);
	console.log('Server is running on port 5000, http://localhost:5000');
});
