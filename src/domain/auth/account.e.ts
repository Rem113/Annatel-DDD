import { EntityProps, UniqueId } from "../core/entity"
import { Email } from "./email.vo"
import Result from "../core/result"
import { AggregateRoot } from "../core/aggregate_root"
import { Password } from "./password.vo"
import { Hash } from "./hash.vo"

export interface AccountProps extends EntityProps {
	id?: UniqueId
	email: Email
	password: Password | Hash
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
}
