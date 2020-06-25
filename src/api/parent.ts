import { Router } from "express"
import { container } from "tsyringe"
import { ParentService } from "../domain/watch/parent_service"
import auth from "./middlewares/auth"
import Should from "../domain/core/should"
import { UniqueId } from "../domain/core/entity"

export default () => {
  const router = Router()

  const parent_service = container.resolve(ParentService)

  router.put("/watch/subscribe", auth, async (req, res) => {
    const { serial, vendor } = req.body
    const { account } = req
    const { name } = req.body

    const maybe = await parent_service.subscribe_to(
      account!.id,
      serial,
      vendor,
      name
    )

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
    const {
      latitude,
      longitude,
      radius,
      name,
      notification,
      time_frames,
    } = req.body

    const error = Should.not_be_null_or_undefined([
      { name: "Latitude", value: latitude },
      { name: "Longitude", value: longitude },
      { name: "Radius", value: radius },
      { name: "Name", value: name },
      { name: "Notification", value: notification },
      { name: "Time frames", value: time_frames },
    ])

    if (error.has_some()) return res.status(400).json(error.get_val())

    const geofence_props = {
      latitude,
      longitude,
      radius,
      name,
      notification,
      time_frames,
    }

    const maybe = await parent_service.define_geofence_for(
      id,
      geofence_props,
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
