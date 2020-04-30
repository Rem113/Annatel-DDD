import { Application } from "express"

import account_routes from "../api/account"

export default async (app: Application) => {
	app.use("/api/account", account_routes)

	console.log("Express initialized")
}
