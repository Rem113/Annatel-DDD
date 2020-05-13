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

	get inserted_at(): Date | undefined {
		return this.props.inserted_at
	}

	get updated_at(): Date | undefined {
		return this.props.updated_at
	}

	generate_token(): string {
		const payload = { id: this.id.to_string(), email: this.email }
		return jwt.sign(payload, process.env.SECRET!, { expiresIn: 3600 })
	}
}
