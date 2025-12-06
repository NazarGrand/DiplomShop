import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "../models/item.model.js";
import Order from "../models/order.model.js";

dotenv.config();

// Старий курс: 1 USD = 37 UAH
const OLD_EXCHANGE_RATE = 37;
// Новий курс: 1 USD = 42 UAH
const NEW_EXCHANGE_RATE = 42;

const reconvertPrices = async () => {
	try {
		// Підключення до MongoDB
		await mongoose.connect(process.env.MONGO_URI, {
			serverSelectionTimeoutMS: 10000,
			socketTimeoutMS: 45000,
		});
		console.log("✅ Підключено до MongoDB");

		// Переконвертація цін в товарах
		const items = await Item.find({});
		console.log(`\n📦 Знайдено ${items.length} товарів`);

		let updatedItems = 0;
		for (const item of items) {
			// Конвертуємо зі старих гривень назад в долари, потім в нові гривні
			const priceInUSD = item.price / OLD_EXCHANGE_RATE;
			const newPrice = Math.round(priceInUSD * NEW_EXCHANGE_RATE * 100) / 100;
			
			await Item.updateOne({ _id: item._id }, { $set: { price: newPrice } });
			console.log(`  ✓ ${item.name}: ${item.price} UAH (старий курс) → ${newPrice} UAH (новий курс)`);
			updatedItems++;
		}

		// Переконвертація цін в замовленнях
		const orders = await Order.find({});
		console.log(`\n📋 Знайдено ${orders.length} замовлень`);

		let updatedOrders = 0;
		for (const order of orders) {
			let hasChanges = false;
			const updatedProducts = order.products.map((product) => {
				const priceInUSD = product.price / OLD_EXCHANGE_RATE;
				const newPrice = Math.round(priceInUSD * NEW_EXCHANGE_RATE * 100) / 100;
				if (product.price !== newPrice) {
					hasChanges = true;
					return { ...product.toObject(), price: newPrice };
				}
				return product;
			});

			const totalInUSD = order.totalAmount / OLD_EXCHANGE_RATE;
			const newTotal = Math.round(totalInUSD * NEW_EXCHANGE_RATE * 100) / 100;

			if (hasChanges || order.totalAmount !== newTotal) {
				await Order.updateOne(
					{ _id: order._id },
					{
						$set: {
							products: updatedProducts,
							totalAmount: newTotal,
						},
					}
				);
				console.log(`  ✓ Замовлення ${order._id}: ${order.totalAmount} UAH (старий курс) → ${newTotal} UAH (новий курс)`);
				updatedOrders++;
			}
		}

		console.log("\n✅ Переконвертація завершена успішно!");
		console.log(`\n📊 Підсумок:`);
		console.log(`   - Оновлено товарів: ${updatedItems}`);
		console.log(`   - Оновлено замовлень: ${updatedOrders}`);
		console.log(`   - Старий курс: 1 USD = ${OLD_EXCHANGE_RATE} UAH`);
		console.log(`   - Новий курс: 1 USD = ${NEW_EXCHANGE_RATE} UAH`);

		await mongoose.disconnect();
		console.log("\n👋 Відключено від MongoDB");
		process.exit(0);
	} catch (error) {
		console.error("❌ Помилка під час переконвертації:", error);
		await mongoose.disconnect();
		process.exit(1);
	}
};

// Запуск переконвертації
reconvertPrices();

