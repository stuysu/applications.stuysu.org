import mongoose from "./../../mongoose";

export default function findByEmail(email) {
	return mongoose.model("User").findOne({ email });
}
