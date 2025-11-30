import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			min: 0,
			required: true,
		},
		images: {
			type: [String],
			required: [true, "At least one image is required"],
			validate: {
				validator: function (v) {
					return v && v.length > 0;
				},
				message: "At least one image is required",
			},
		},
		// Залишаємо для зворотної сумісності (deprecated)
		image: {
			type: String,
			required: false,
		},
		category: {
			type: String,
			required: true,
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		specifications: {
			type: [
				{
					name: {
						type: String,
						required: true,
					},
					value: {
						type: String,
						required: true,
					},
				},
			],
			default: [],
		},
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
