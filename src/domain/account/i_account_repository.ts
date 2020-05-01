import { Email } from "./email.vo"
import { Maybe } from "../core/maybe"
import { Account } from "./account.agg"

export interface IAccountRepository {
	with_email(email: Email): Promise<Maybe<Account>>
	register(account: Account): Promise<void>
}
