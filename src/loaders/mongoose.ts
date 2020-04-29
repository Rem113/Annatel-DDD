import mongoose from "mongoose"

export default async () => {
	await mongoose.connect(
		"mongodb+srv://admin:admin@cluster0-q28xg.mongodb.net/Annatel?retryWrites=true&w=majority",
		{ useUnifiedTopology: true, useNewUrlParser: true }
	)
	console.log("Mongoose connected")
}
