import { container } from "tsyringe"
import { Router } from "express"
import { WatchService } from "../domain/watch/watch_service"
import {
	InvalidWatchDataFailure,
	NoLocationDataFailure,
} from "../domain/watch/watch_failures"
import { Serial } from "../domain/watch/serial.vo"
import { MessageType, Message } from "../domain/watch/message.e"
import Should from "../domain/core/should"

export default () => {
	const router = Router()

	const watch_service = container.resolve(WatchService)

	router.post("/message", async (req, res) => {
		const { vendor, type, length, payload } = req.body

		const error = Should.not_be_null_or_undefined([
			{
				name: "Vendor",
				value: vendor,
			},
			{ name: "Type", value: type },
			{ name: "Length", value: length },
		])

		if (error.has_some()) return res.status(400).json(error)

		const message_type = MessageType[type as keyof typeof MessageType]

		const serial = Serial.create({ serial: req.body.serial })

		if (serial.is_err())
			return res.status(400).json({
				serial: serial.get_err(),
			})

		const message = Message.create({
			type: message_type,
			length,
			payload,
			posted_at: new Date(),
		})

		const result = await watch_service.post_message(
			message.get_val(),
			serial.get_val(),
			vendor
		)

		return result.fold(
			(err) => {
				switch (err.constructor) {
					case InvalidWatchDataFailure:
						return res.status(400).json(err.unwrap())
					default:
						throw new Error(`Unhandled case: ${err.constructor.name}`)
				}
			},
			() => res.status(201).end()
		)
	})

	router.get("/message", async (req, res) => {
		const { vendor } = req.body

		const serial = Serial.create({ serial: req.body.serial })

		if (serial.is_err())
			return res.status(400).json({
				serial: serial.get_err(),
			})

		const result = await watch_service.read_messages_of(
			serial.get_val(),
			vendor
		)

		return result.fold(
			(err) => {
				switch (err.constructor) {
					case InvalidWatchDataFailure:
						return res.status(400).json(err.unwrap())
					default:
						throw new Error(`Unhandled case: ${err.constructor.name}`)
				}
			},
			(messages) =>
				res.status(200).json(
					messages.map((message) => ({
						length: message.length,
						type: MessageType[message.type],
						payload: message.payload,
					}))
				)
		)
	})

	router.get("/location", async (req, res) => {
		const { vendor } = req.body

		const serial = Serial.create({ serial: req.body.serial })

		if (serial.is_err())
			return res.status(400).json({
				serial: serial.get_err(),
			})

		const result = await watch_service.get_location_of(serial.get_val(), vendor)

		return result.fold(
			(err) => {
				switch (err.constructor) {
					case NoLocationDataFailure:
						return res.status(404).json(err.unwrap())
					case InvalidWatchDataFailure:
						return res.status(400).json(err.unwrap())
					default:
						throw new Error(`Unhandled case: ${err.constructor.name}`)
				}
			},
			(location) => res.status(200).json(location)
		)
	})

	return router
}
