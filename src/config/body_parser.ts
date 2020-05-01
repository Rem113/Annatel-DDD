import { Application } from "express"
import bodyparser from "body-parser"

export default (app: Application) => {
	app.use(bodyparser.json())
	app.use(bodyparser.urlencoded({ extended: true }))

	console.log("Body parser initialized")
}
