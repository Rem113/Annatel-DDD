import { ValueObjectProps, ValueObject } from "../core/value_object"
import Should from "../core/should"

export interface EmailProps extends ValueObjectProps {
	email: string
}

export class Email extends ValueObject<EmailProps> {
	private static readonly email_regex = new RegExp(
		/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
	)

	static create(props: EmailProps): Email {
		const error = Should.not_be_null_or_undefined([
			{ name: "email", value: props.email },
		])

		if (error.has_some()) throw error.get_val()

		if (!Email.email_regex.test(props.email)) throw "Not a valid email"

		return new Email(props)
	}

	get email(): string {
		return this.value.email
	}
}
