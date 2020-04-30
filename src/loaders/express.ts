import { Application } from "express"

import account_routes from "../api/account"

export default async (app: Application) => {
	app.use("/api/account", account_routes())

	app.listen(3000, () => console.log("Listening on port 3000!"))

	console.log("Express initialized")
}
