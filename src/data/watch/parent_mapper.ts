import ParentModel, { IParentDocument } from "./parent_model"
import { UniqueId } from "../../domain/core/entity"
import { Parent } from "../../domain/watch/parent.agg"
import { Subscription } from "../../domain/watch/subscription.e"
import { Geofence } from "../../domain/watch/geofence.vo"
import { TimeFrame } from "../../domain/watch/time_frame.vo"

export class ParentMapper {
	static to_persistance(parent: Parent): IParentDocument {
		return new ParentModel({
			_id: parent.id.to_string(),
			account: parent.account,
			inserted_at: parent.inserted_at,
			updated_at: parent.updated_at,
			subscriptions: [
				...parent.subscriptions.map((subscription) => ({
					_id: subscription.id.to_string(),
					watch: subscription.watch.to_string(),
					geofences: [
						...subscription.geofences.map((geofence) => ({
							time_frames: [
								...geofence.time_frames.map((time_frame) => ({
									day_of_week: time_frame.day_of_week,
									from: time_frame.from,
									to: time_frame.to,
								})),
							],
							latitude: geofence.latitude,
							longitude: geofence.longitude,
							name: geofence.name,
							notification: geofence.notification,
							radius: geofence.radius,
						})),
					],
				})),
			],
		})
	}

	static from_persistance(document: IParentDocument): Parent {
		const parent = {
			id: new UniqueId(document.id),
			account: new UniqueId(document.account),
			inserted_at: document.inserted_at,
			updated_at: document.updated_at,
			subscriptions: [
				...document.subscriptions.map((subscription) =>
					Subscription.create({
						id: new UniqueId(subscription.id),
						watch: new UniqueId(subscription.watch),
						geofences: [
							...subscription.geofences.map((geofence) =>
								Geofence.create({
									time_frames: [
										...geofence.time_frames.map((time_frame) =>
											TimeFrame.create({
												day_of_week: time_frame.day_of_week,
												from: time_frame.from,
												to: time_frame.to,
											})
										),
									],
									latitude: geofence.latitude,
									longitude: geofence.longitude,
									name: geofence.name,
									notification: geofence.notification,
									radius: geofence.radius,
								})
							),
						],
					})
				),
			],
		}

		return Parent.create(parent)
	}
}
