import { ValueObject, ValueObjectProps } from "../core/value_object"
import { Result } from "../core/result"

export interface PasswordProps extends ValueObjectProps {
	password: string
}

export class Password extends ValueObject<PasswordProps> {
	static create(props: PasswordProps): Result<Password> {
		if (props.password.length < 8) return Result.fail("Password is too short")
		return Result.ok(new Password(props))
	}
}
