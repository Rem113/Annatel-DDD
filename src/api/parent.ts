import { Router } from "express"
import { container } from "tsyringe"
import { ParentService } from "../domain/watch/parent_service"
import auth from "./middlewares/auth"
import { Serial } from "../domain/watch/serial.vo"

export default () => {
	const router = Router()

	const parent_service = container.resolve(ParentService)

	router.put("/subscribe", auth, async (req, res) => {
		const { account } = req
		const { vendor } = req.body

		const serial = Serial.create({ serial: req.body.serial })

		if (serial.is_err()) return res.status(400).json(serial.get_err())

		const maybe = await parent_service.subscribe_to(
			serial.get_val(),
			vendor,
			account!.id
		)

		// TODO: Handle different failures
		return maybe.fold(
			(err) => res.status(400).json(err.unwrap()),
			() => res.status(200).end()
		)
	})

	router.put("/unsubscribe", auth, async (req, res) => {
		const { account } = req
		const { vendor } = req.body

		const serial = Serial.create({ serial: req.body.serial })

		if (serial.is_err()) return res.status(400).json(serial.get_err())

		const maybe = await parent_service.unsubscribe_from(
			serial.get_val(),
			vendor,
			account!.id
		)

		// TODO: Handle different failures
		return maybe.fold(
			(err) => res.status(400).json(err.unwrap()),
			() => res.status(200).end()
		)
	})

	return router
}
