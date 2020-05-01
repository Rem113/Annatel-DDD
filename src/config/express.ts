import { Application } from "express"

import account_routes from "../api/account"
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

	app.listen(3000, () => console.log("Listening on port 3000!"))

	console.log("Express initialized")
}
