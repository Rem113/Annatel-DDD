import { ValueObjectProps, ValueObject } from "../core/value_object"
import { TimeFrame } from "./time_frame.vo"
import Result from "../core/result"

export interface GeofenceProps extends ValueObjectProps {
	time_frames: TimeFrame[]
	latitude: number
	longitude: number
	name: string
	notification: boolean
	radius: number
}

export class Geofence extends ValueObject<GeofenceProps> {
	static create(props: GeofenceProps): Result<Geofence> {
		return Result.ok(new Geofence(props))
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
