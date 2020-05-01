import { ValueObjectProps, ValueObject } from "../core/value_object"
import Result from "../core/result"

export interface SerialNumberProps extends ValueObjectProps {
	serial: string
}

export class SerialNumber extends ValueObject<SerialNumberProps> {
	static create(props: SerialNumberProps): Result<SerialNumber> {
		if (props.serial.length !== 9)
			return Result.fail("Serial number is invalid")
		return Result.ok(new SerialNumber(props))
	}

	get serial(): string {
		return this.value.serial
	}
}
