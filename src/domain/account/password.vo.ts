import { ValueObject, ValueObjectProps } from "../core/value_object"
import Result from "../core/result"
import bcrypt from "bcryptjs"
import Should from "../core/should"
import { Hash } from "./hash.vo"

export interface PasswordProps extends ValueObjectProps {
	password: string
}

export class Password extends ValueObject<PasswordProps> {
	private _hash?: Hash

	static create(props: PasswordProps): Password {
		const error = Should.not_be_null_or_undefined([
			{ name: "Password", value: props.password },
		])
		if (error.has_some()) throw error.get_val()

		if (props.password.length < 8) throw "Password is too short"
		return new Password(props)
	}

	compare_hash(hash: string): boolean {
		return bcrypt.compareSync(this.value.password, hash)
	}

	get hash(): string {
		if (!this._hash) {
			const salt = bcrypt.genSaltSync(10)
			this._hash = new Hash({
				hash: bcrypt.hashSync(this.value.password, salt),
			})
		}

		return this._hash.hash
	}
}
