import { ValueObjectProps, ValueObject } from "../core/value_object"
import Should from "../core/should"

export enum DayOfWeek {
	SUNDAY,
	MONDAY,
	TUESDAY,
	WEDNESDAY,
	THURSDAY,
	FRIDAY,
	SATURDAY,
}

export interface TimeFrameProps extends ValueObjectProps {
	day_of_week: DayOfWeek
	from: number
	to: number
}

export class TimeFrame extends ValueObject<TimeFrameProps> {
	static create(props: TimeFrameProps): TimeFrame {
		const error = Should.not_be_null_or_undefined([
			{ name: "Day of week", value: props.day_of_week },
			{ name: "From", value: props.from },
			{ name: "To", value: props.to },
		])

		if (error.has_some()) throw error.get_val()

		if (props.from < 0 || props.from > 2359)
			throw "From should range between 00:00 and 23:59"
		if (props.to < 0 || props.to > 2359)
			throw "To should range between 00:00 and 23:59"

		return new TimeFrame(props)
	}

	get day_of_week(): DayOfWeek {
		return this.value.day_of_week
	}

	get from(): number {
		return this.value.from
	}

	get to(): number {
		return this.value.to
	}
}
