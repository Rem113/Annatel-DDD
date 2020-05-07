import { container } from "tsyringe"
import { Router } from "express"
import { WatchService } from "../domain/watch/watch_service"
import auth from "./middlewares/auth"
import { InvalidInput, InvalidMessage } from "../domain/watch/watch_failures"

export default () => {
	const router = Router()

	const watch_service = container.resolve(WatchService)

	router.post("/message", auth, async (req, res) => {
		const { serial, vendor, type, length, payload } = req.body

		const result = await watch_service.post_message(
			serial,
			vendor,
			type,
			length,
			payload
		)

		return result.fold(
			(err) => {
				switch (err.constructor) {
					case InvalidInput:
					case InvalidMessage:
						return res.status(400).json(err.unwrap())
					default:
						throw new Error(`Unhandled case: ${err.constructor.name}`)
				}
			},
			(_) => res.status(201).end()
		)
	})

	return router
}
