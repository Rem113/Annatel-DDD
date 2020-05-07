import { ValueObjectProps, ValueObject } from "../core/value_object"
import Result from "../core/result"
import Should from "../core/should"

export interface SerialProps extends ValueObjectProps {
	serial: string
}

export class Serial extends ValueObject<SerialProps> {
	static create(props: SerialProps): Result<Serial> {
		const error = Should.not_be_null_or_undefined([
			{
				name: "Serial",
				value: props.serial,
			},
		])
		if (error.has_some()) return Result.fail(error.get_val() as string)

		if (props.serial.length !== 9)
			return Result.fail("Serial number is invalid")
		return Result.ok(new Serial(props))
	}

	get serial(): string {
		return this.value.serial
	}
}
