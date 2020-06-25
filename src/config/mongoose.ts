import mongoose from "mongoose"

export default async () => {
  mongoose.set("useFindAndModify", false)

  await mongoose.connect(
    "mongodb://admin:gabhil@88.218.220.20:9000/Annatel?authSource=admin",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  )

  console.log("Mongoose initialized")
}
