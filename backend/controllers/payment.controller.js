import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
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

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage),
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
			await createNewCoupon(req.user._id);
		}
		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		console.log("=== CHECKOUT SUCCESS CALLED ===");
		const { sessionId } = req.body;
		console.log("Session ID:", sessionId);

		if (!sessionId) {
			console.error("❌ No sessionId provided");
			return res.status(400).json({ message: "Session ID is required" });
		}

		const session = await stripe.checkout.sessions.retrieve(sessionId);
		console.log("Session retrieved:", {
			id: session.id,
			payment_status: session.payment_status,
			amount_total: session.amount_total,
			metadata: session.metadata,
		});

		if (session.payment_status === "paid") {
			// Check if order already exists
			const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
			if (existingOrder) {
				console.log("⚠️ Order already exists for this session:", existingOrder._id);
				return res.status(200).json({
					success: true,
					message: "Order already exists",
					orderId: existingOrder._id,
				});
			}

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
				console.log("✅ Coupon deactivated");
			}

			// Verify user exists
			const mongoose = (await import("mongoose")).default;
			const Customer = (await import("../models/customer.model.js")).default;
			
			const userId = session.metadata.userId;
			console.log("User ID from metadata:", userId);
			
			const userExists = await Customer.findById(userId);
			if (!userExists) {
				console.error("❌ User not found in database:", userId);
				return res.status(400).json({ 
					message: "User not found",
					error: "The user associated with this order does not exist"
				});
			}
			console.log("✅ User found:", userExists.email);

			// create a new Order
			const products = JSON.parse(session.metadata.products);
			console.log("Products from metadata:", products);

			const newOrder = new Order({
				user: userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100, // convert from cents to hryvnias,
				stripeSessionId: sessionId,
			});

			console.log("Attempting to save order:", {
				user: newOrder.user,
				totalAmount: newOrder.totalAmount,
				productsCount: newOrder.products.length,
				stripeSessionId: newOrder.stripeSessionId,
			});

			try {
				await newOrder.save();
				console.log("✅ Order created successfully:", newOrder._id);
				console.log("Order details:", {
					_id: newOrder._id,
					user: newOrder.user,
					totalAmount: newOrder.totalAmount,
					productsCount: newOrder.products.length,
					createdAt: newOrder.createdAt,
				});

				res.status(200).json({
					success: true,
					message: "Payment successful, order created, and coupon deactivated if used.",
					orderId: newOrder._id,
				});
			} catch (saveError) {
				console.error("❌ Error saving order:", saveError);
				console.error("Error details:", {
					message: saveError.message,
					name: saveError.name,
					code: saveError.code,
					stack: saveError.stack,
				});
				throw saveError;
			}
		} else {
			console.warn("⚠️ Payment status is not 'paid':", session.payment_status);
			res.status(400).json({
				success: false,
				message: `Payment status is ${session.payment_status}, not paid`,
			});
		}
	} catch (error) {
		console.error("❌ Error processing successful checkout:", error);
		console.error("Error stack:", error.stack);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});

	return coupon.id;
}

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}
