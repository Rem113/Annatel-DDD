import { Application } from "express"

import account_routes from "../api/account"
import parent_routes from "../api/parent"
import watch_routes from "../api/watch"

import Account from "../api/core/account"

declare global {
	namespace Express {
		interface Request {
			account?: Account
		}
	}
}

export default async (app: Application) => {
	app.use("/api/account", account_routes())
	app.use("/api/parent", parent_routes())
	app.use("/api/watch", watch_routes())

	app.listen(3000, () => console.log("Listening on port 3000!"))

	console.log("Express initialized")
}
