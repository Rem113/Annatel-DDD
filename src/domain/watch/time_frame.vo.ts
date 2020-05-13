import { ValueObjectProps, ValueObject } from "../core/value_object"
import Result from "../core/result"

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
	static create(props: TimeFrameProps): Result<TimeFrame> {
		return Result.ok(new TimeFrame(props))
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
