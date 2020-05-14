import { IGeofence } from "../../data/watch/parent_model"
import { Geofence } from "./geofence.vo"

export interface GeofencesForDTO {
	geofences: IGeofence[]
}

export const build_geofences_for_dto = (
	geofences: Geofence[]
): GeofencesForDTO => ({
	geofences: geofences.map((geofence) => ({
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
})
