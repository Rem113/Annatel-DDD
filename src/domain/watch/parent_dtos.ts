import { IGeofence } from "../../data/watch/parent_model"
import { Subscription } from "./subscription.e"

interface ISubscription {
	watch: string
	geofences: IGeofence[]
}

export interface SubscriptionsDTO {
	subscriptions: ISubscription[]
}

export const build_subscriptions_dto = (
	subscriptions: Subscription[]
): SubscriptionsDTO => ({
	subscriptions: subscriptions.map((subscription) => ({
		watch: subscription.watch.to_string(),
		geofences: subscription.geofences.map((geofence) => ({
			latitude: geofence.latitude,
			longitude: geofence.longitude,
			radius: geofence.radius,
			name: geofence.name,
			notification: geofence.notification,
			time_frames: geofence.time_frames.map((time_frame) => ({
				day_of_week: time_frame.day_of_week,
				from: time_frame.from,
				to: time_frame.to,
			})),
		})),
	})),
})
