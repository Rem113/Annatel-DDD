import { Email } from "./email.vo"
import { Maybe } from "../core/maybe"
import { Account } from "./account.e"

export interface IAccount {
	email: string
	password: string
}

export interface IAccountRepository {
	with_email(email: Email): Promise<Maybe<IAccount>>
	register(account: Account): Promise<void>
}
