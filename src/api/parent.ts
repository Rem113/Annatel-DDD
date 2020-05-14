import { Router } from "express"
import { container } from "tsyringe"
import { ParentService } from "../domain/watch/parent_service"
import auth from "./middlewares/auth"
import { Serial } from "../domain/watch/serial.vo"
import { Geofence } from "../domain/watch/geofence.vo"
import {
	TimeFrame,
	DayOfWeek,
	TimeFrameProps,
} from "../domain/watch/time_frame.vo"
import Result from "../domain/core/result"

export default () => {
	const router = Router()

	const parent_service = container.resolve(ParentService)

	// TODO: Validate req.body
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

	// TODO: Validate req.body
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

	router.put("/geofence", auth, async (req, res) => {
		const { account } = req
		const { vendor, latitude, longitude, radius, name, notification } = req.body

		const serial = Serial.create({ serial: req.body.serial })

		if (serial.is_err()) return res.status(400).json(serial.get_err())

		const time_frames = req.body.time_frames.map((time_frame: TimeFrameProps) =>
			TimeFrame.create(time_frame)
		)

		if (!Result.are_ok(time_frames))
			return res
				.status(400)
				.json(
					time_frames.map((time_frame: Result<TimeFrame>) =>
						time_frame.get_err()
					)
				)

		const geofence = Geofence.create({
			latitude,
			longitude,
			name,
			notification,
			radius,
			time_frames: time_frames.map((time_frame: Result<TimeFrame>) =>
				time_frame.get_val()
			),
		})

		if (geofence.is_err()) return res.status(400).json(geofence.get_err())

		const maybe = await parent_service.define_geofence_for(
			serial.get_val(),
			vendor,
			geofence.get_val(),
			account!.id
		)

		return maybe.fold(
			(err) => res.status(400).json(err.unwrap()),
			() => res.status(200).end()
		)
	})

	router.get("/geofence", auth, async (req, res) => {
		const { account } = req
		const { vendor } = req.body

		const serial = Serial.create({ serial: req.body.serial })

		if (serial.is_err()) return res.status(400).json(serial.get_err())

		const result = await parent_service.geofences_for(
			serial.get_val(),
			vendor,
			account!.id
		)

		return result.fold(
			(err) => res.status(400).json(err.unwrap()),
			(dto) => res.status(200).json(dto)
		)
	})

	return router
}
