import { ValueObjectProps, ValueObject } from "../core/value_object"
import Result from "../core/result"
import Should from "../core/should"

export interface EmailProps extends ValueObjectProps {
	email: string
}

export class Email extends ValueObject<EmailProps> {
	private static readonly email_regex = new RegExp(
		/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
	)

	static create(props: EmailProps): Result<Email> {
		const error = Should.not_be_null_or_undefined([
			{ name: "email", value: props.email },
		])

		if (error.has_some()) return Result.fail(error.get_val() as string)

		if (!Email.email_regex.test(props.email))
			return Result.fail("Not a valid email")

		return Result.ok(new Email(props))
	}

	get email(): string {
		return this.value.email
	}
}
