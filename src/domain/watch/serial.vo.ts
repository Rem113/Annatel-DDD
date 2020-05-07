import { ValueObjectProps, ValueObject } from "../core/value_object"
import Result from "../core/result"

export interface SerialProps extends ValueObjectProps {
	serial: string
}

export class Serial extends ValueObject<SerialProps> {
	static create(props: SerialProps): Result<Serial> {
		if (props.serial === null || props.serial === undefined)
			return Result.fail("Please enter a serial number")
		if (props.serial.length !== 9)
			return Result.fail("Serial number is invalid")
		return Result.ok(new Serial(props))
	}

	get serial(): string {
		return this.value.serial
	}
}
