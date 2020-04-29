import { ValueObject, ValueObjectProps } from "../core/value_object"
import { Result } from "../core/result"
import bcrypt from "bcryptjs"

export interface PasswordProps extends ValueObjectProps {
	password: string
}

export class Password extends ValueObject<PasswordProps> {
	static create(props: PasswordProps): Result<Password> {
		if (props.password.length < 8) return Result.fail("Password is too short")
		return Result.ok(new Password(props))
	}

	get password(): string {
		return this.value.password
	}

	hash(): Password {
		const salt = bcrypt.genSaltSync(10)
		const hash = bcrypt.hashSync(this.value.password, salt)

		return Password.create({ password: hash }).get_val()
	}
}
