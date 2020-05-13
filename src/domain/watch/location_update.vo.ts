import { ValueObjectProps, ValueObject } from "../core/value_object"
import Result from "../core/result"
import Should from "../core/should"

export interface LocationUpdateProps extends ValueObjectProps {
	longitude: number
	latitude: number
	last_update: Date
}

export class LocationUpdate extends ValueObject<LocationUpdateProps> {
	static create(props: LocationUpdateProps): Result<LocationUpdate> {
		const error = Should.not_be_null_or_undefined([
			{
				name: "Longitude",
				value: props.longitude,
			},
			{
				name: "Latitude",
				value: props.latitude,
			},
			{
				name: "Last Update",
				value: props.last_update,
			},
		])

		if (error.has_some()) return Result.fail(error.get_val() as string)

		return Result.ok(new LocationUpdate(props))
	}

	get latitude(): number {
		return this.value.latitude
	}

	get longitude(): number {
		return this.value.longitude
	}

	get last_update(): Date {
		return this.value.last_update
	}
}
