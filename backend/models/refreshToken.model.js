import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		token: {
			type: String,
			required: true,
			unique: true,
		},
		expiresAt: {
			type: Date,
			required: true,
			index: { expireAfterSeconds: 0 }, // Автоматично видаляє документ після expiresAt
		},
	},
	{
		timestamps: true,
	}
);

// Індекс для швидкого пошуку по userId та token
refreshTokenSchema.index({ userId: 1, token: 1 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;

