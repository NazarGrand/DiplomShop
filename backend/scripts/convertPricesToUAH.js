import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "../models/item.model.js";
import Order from "../models/order.model.js";

dotenv.config();

// Exchange rate: 1 USD = 42 UAH (can be changed)
const EXCHANGE_RATE = 42;

const convertPrices = async () => {
	try {
		// Connect to MongoDB
		await mongoose.connect(process.env.MONGO_URI, {
			serverSelectionTimeoutMS: 10000,
			socketTimeoutMS: 45000,
		});
		console.log("✅ Підключено до MongoDB");

		// Convert prices in products
		// Item uses "Product" model in MongoDB, so it covers all products
		const items = await Item.find({});
		console.log(`\n📦 Знайдено ${items.length} товарів`);

		let updatedItems = 0;
		for (const item of items) {
			const oldPrice = item.price;
			const newPrice = Math.round(oldPrice * EXCHANGE_RATE * 100) / 100; // Round to 2 decimal places
			
			await Item.updateOne({ _id: item._id }, { $set: { price: newPrice } });
			console.log(`  ✓ ${item.name}: ${oldPrice} USD → ${newPrice} UAH`);
			updatedItems++;
		}

		// Convert prices in orders
		const orders = await Order.find({});
		console.log(`\n📋 Знайдено ${orders.length} замовлень`);

		let updatedOrders = 0;
		for (const order of orders) {
			let hasChanges = false;
			const updatedProducts = order.products.map((product) => {
				const oldPrice = product.price;
				const newPrice = Math.round(oldPrice * EXCHANGE_RATE * 100) / 100;
				if (oldPrice !== newPrice) {
					hasChanges = true;
					return { ...product.toObject(), price: newPrice };
				}
				return product;
			});

			const oldTotal = order.totalAmount;
			const newTotal = Math.round(oldTotal * EXCHANGE_RATE * 100) / 100;

			if (hasChanges || oldTotal !== newTotal) {
				await Order.updateOne(
					{ _id: order._id },
					{
						$set: {
							products: updatedProducts,
							totalAmount: newTotal,
						},
					}
				);
				console.log(`  ✓ Замовлення ${order._id}: ${oldTotal} USD → ${newTotal} UAH`);
				updatedOrders++;
			}
		}

		console.log("\n✅ Міграція завершена успішно!");
		console.log(`\n📊 Підсумок:`);
		console.log(`   - Оновлено товарів: ${updatedItems}`);
		console.log(`   - Оновлено замовлень: ${updatedOrders}`);
		console.log(`   - Курс конвертації: 1 USD = ${EXCHANGE_RATE} UAH`);
		console.log(`\n⚠️  УВАГА: Якщо потрібно змінити курс, відредагуйте EXCHANGE_RATE в файлі скрипта`);

		await mongoose.disconnect();
		console.log("\n👋 Відключено від MongoDB");
		process.exit(0);
	} catch (error) {
		console.error("❌ Помилка під час міграції:", error);
		await mongoose.disconnect();
		process.exit(1);
	}
};

// Run migration
convertPrices();

