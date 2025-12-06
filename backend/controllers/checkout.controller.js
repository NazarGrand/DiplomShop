import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { paymentGateway } from "../lib/paymentService.js";

const createStripeDiscount = async (discountPercent) => {
	try {
		const coupon = await paymentGateway.coupons.create({
			percent_off: discountPercent,
			duration: "once",
		});
		return coupon.id;
	} catch (error) {
		console.log("Error creating Stripe coupon", error);
		throw error;
	}
};

export const initializeCheckout = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100);
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "uah",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		const session = await paymentGateway.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeDiscount(coupon.discountPercentage),
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		if (totalAmount >= 20000) {
			await generateNewCoupon(req.user._id);
		}

		res.json({ id: session.id });
	} catch (error) {
		console.log("Error in initializeCheckout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const verifyPayment = async (req, res) => {
	try {
		const { session_id } = req.query;
		const session = await paymentGateway.checkout.sessions.retrieve(session_id);

		if (session.payment_status === "paid") {
			if (session.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId,
					},
					{
						isActive: false,
					}
				);
			}

			const products = JSON.parse(session.metadata.products);
			const newOrder = new Order({
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100,
				stripeSessionId: session_id,
			});

			await newOrder.save();

			return res.json({ verified: true, order: newOrder });
		}

		res.json({ verified: false });
	} catch (error) {
		console.log("Error in verifyPayment controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function generateNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}

