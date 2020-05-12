import { ValueObjectProps, ValueObject } from "../core/value_object"
import Result from "../core/result"
import Should from "../core/should"

export interface LocationProps extends ValueObjectProps {
	longitude: number
	latitude: number
}

export class Location extends ValueObject<LocationProps> {
	static create(props: LocationProps): Result<Location> {
		const error = Should.not_be_null_or_undefined([
			{
				name: "Longitude",
				value: props.longitude,
			},
			{
				name: "Latitude",
				value: props.latitude,
			},
		])

		if (error.has_some()) return Result.fail(error.get_val() as string)

		return Result.ok(new Location(props))
	}
}
