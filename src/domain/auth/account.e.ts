import { EntityProps } from "../core/entity"
import { Email } from "./email.vo"
import Result from "../core/result"
import { AggregateRoot } from "../core/aggregate_root"
import { Password } from "./password.vo"

export interface AccountProps extends EntityProps {
	email: Email
	password: Password
}

export class Account extends AggregateRoot<AccountProps> {
	static create(props: AccountProps): Result<Account> {
		return Result.ok(new Account(props))
	}

	get email(): string {
		return this.props.email.email
	}

	get password(): string {
		return this.props.password.password
	}

	hash_password() {
		this.props.password = this.props.password.hash()
	}
}
