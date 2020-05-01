import { EntityProps } from "../core/entity"
import { Email } from "./email.vo"
import Result from "../core/result"
import { AggregateRoot } from "../core/aggregate_root"
import { Password } from "./password.vo"
import { Hash } from "./hash.vo"
import jwt from "jsonwebtoken"

export interface AccountProps extends EntityProps {
	email: Email
	password: Password | Hash
	inserted_at?: Date
	updated_at?: Date
}

export class Account extends AggregateRoot<AccountProps> {
	static create(props: AccountProps): Result<Account> {
		return Result.ok(new Account(props))
	}

	get email(): string {
		return this.props.email.email
	}

	get password_hash(): string {
		return this.props.password.hash
	}

	generate_token(): string {
		const payload = { id: this.props.id, email: this.props.email }
		return jwt.sign(payload, "it is a secret", { expiresIn: 3600 })
	}
}
