import mongoose from "mongoose";

const sessionTokenSchema = new mongoose.Schema(
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
			index: { expireAfterSeconds: 0 },
		},
	},
	{
		timestamps: true,
	}
);

sessionTokenSchema.index({ userId: 1, token: 1 });

const SessionToken = mongoose.model("RefreshToken", sessionTokenSchema);

export default SessionToken;

