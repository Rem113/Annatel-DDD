import { Router } from "express"
import { container } from "tsyringe"
import { ParentService } from "../domain/watch/parent_service"
import auth from "./middlewares/auth"
import { Geofence } from "../domain/watch/geofence.vo"
import { TimeFrame, TimeFrameProps } from "../domain/watch/time_frame.vo"
import Result from "../domain/core/result"
import Should from "../domain/core/should"
import { UniqueId } from "../domain/core/entity"

export default () => {
	const router = Router()

	const parent_service = container.resolve(ParentService)

	router.put("/watch/:id/subscribe", auth, async (req, res) => {
		const id = new UniqueId(req.params.id)
		const { account } = req

		const maybe = await parent_service.subscribe_to(id, account!.id)

		// TODO: Handle different failures
		return maybe.fold(
			(err) => res.status(400).json(err.unwrap()),
			() => res.status(200).end()
		)
	})

	router.put("/watch/:id/unsubscribe", auth, async (req, res) => {
		const id = new UniqueId(req.params.id)
		const { account } = req

		const maybe = await parent_service.unsubscribe_from(id, account!.id)

		// TODO: Handle different failures
		return maybe.fold(
			(err) => res.status(400).json(err.unwrap()),
			() => res.status(200).end()
		)
	})

	router.put("/watch/:id/geofence", auth, async (req, res) => {
		const id = new UniqueId(req.params.id)
		const { account } = req
		const { latitude, longitude, radius, name, notification } = req.body

		const error = Should.not_be_null_or_undefined([
			{ name: "Latitude", value: latitude },
			{ name: "Longitude", value: longitude },
			{ name: "Radius", value: radius },
			{ name: "Name", value: name },
			{ name: "Notification", value: notification },
		])

		if (error.has_some()) return res.status(400).json(error.get_val())

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
			id,
			geofence.get_val(),
			account!.id
		)

		return maybe.fold(
			(err) => res.status(400).json(err.unwrap()),
			() => res.status(200).end()
		)
	})

	router.get("/subscriptions", auth, async (req, res) => {
		const { account } = req

		const result = await parent_service.subscriptions(account!.id)

		return result.fold(
			(err) => res.status(400).json(err.unwrap()),
			(dto) => res.status(200).json(dto)
		)
	})

	return router
}
