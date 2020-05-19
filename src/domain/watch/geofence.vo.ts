import { ValueObjectProps, ValueObject } from "../core/value_object"
import { TimeFrame } from "./time_frame.vo"
import Should from "../core/should"

export interface GeofenceProps extends ValueObjectProps {
	time_frames: TimeFrame[]
	latitude: number
	longitude: number
	name: string
	notification: boolean
	radius: number
}

export class Geofence extends ValueObject<GeofenceProps> {
	static create(props: GeofenceProps): Geofence {
		const error = Should.not_be_null_or_undefined([
			{
				name: "Latitude",
				value: props.latitude,
			},
			{
				name: "Longitude",
				value: props.latitude,
			},
			{
				name: "Name",
				value: props.name,
			},
			{
				name: "Radius",
				value: props.radius,
			},
		])

		if (error.has_some()) throw error.get_val()

		if (props.radius < 0) throw "Radius should be positive"
		if (props.latitude > 90 || props.latitude < -90)
			throw "Latitude ranges between 90 and -90"
		if (props.longitude > 180 || props.longitude < -180)
			throw "Longitude ranges between 180 and -180"

		return new Geofence(props)
	}

	get time_frames(): TimeFrame[] {
		return this.value.time_frames
	}

	get latitude(): number {
		return this.value.latitude
	}

	get longitude(): number {
		return this.value.longitude
	}

	get name(): string {
		return this.value.name
	}

	get notification(): boolean {
		return this.value.notification
	}

	get radius(): number {
		return this.value.radius
	}
}
