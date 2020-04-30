import express from "express"

import body_parser_loader from "./body_parser"
import container_loader from "./container"
import express_loader from "./express"
import mongoose_loader from "./mongoose"

export default async () => {
	const app = express()
	body_parser_loader(app)
	container_loader()

	await Promise.all([mongoose_loader(), express_loader(app)])
}
