import { ValueObject, ValueObjectProps } from "../core/value_object"
import Result from "../core/result"
import bcrypt from "bcryptjs"

export interface PasswordProps extends ValueObjectProps {
	password: string
}

export class Password extends ValueObject<PasswordProps> {
	private _hash?: string

	static create(props: PasswordProps): Result<Password> {
		if (props.password === null || props.password === undefined)
			return Result.fail("Please enter a password")
		if (props.password.length < 8) return Result.fail("Password is too short")
		return Result.ok(new Password(props))
	}

	compare_hash(hash: string): boolean {
		return bcrypt.compareSync(this.password, hash)
	}

	get password(): string {
		return this.value.password
	}

	get hash(): string {
		if (!this._hash) {
			const salt = bcrypt.genSaltSync(10)
			this._hash = bcrypt.hashSync(this.value.password, salt)
		}

		return this._hash
	}
}
