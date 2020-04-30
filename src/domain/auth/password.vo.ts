import { ValueObject, ValueObjectProps } from "../core/value_object"
import Result from "../core/result"
import bcrypt from "bcryptjs"

export interface PasswordProps extends ValueObjectProps {
	password: string
}

export class Password extends ValueObject<PasswordProps> {
	static create(props: PasswordProps): Result<Password> {
		if (props.password === null || props.password === undefined)
			return Result.fail("Please enter a password")
		if (props.password.length < 8) return Result.fail("Password is too short")
		return Result.ok(new Password(props))
	}

	compare_hash(hash: string): boolean {
		return this.hash === hash
	}

	get password(): string {
		return this.value.password
	}

	get hash(): string {
		const salt = bcrypt.genSaltSync(10)
		const hash = bcrypt.hashSync(this.value.password, salt)

		return hash
	}
}
