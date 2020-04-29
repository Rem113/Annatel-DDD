import { IAccountRepository } from "./i_account_repository"
import { Account } from "./account.e"
import { Result, Unit } from "../core/result"
import { AccountCreatedEvent } from "./account_created.de"
import { Email } from "./email.vo"

export class AccountService {
	private readonly account_repo: IAccountRepository

	constructor(account_repo: IAccountRepository) {
		this.account_repo = account_repo
	}

	async register(account: Account): Promise<Result<Unit>> {
		const previous_account = await this.account_repo.with_email(
			Email.create({ email: account.email }).get_val()
		)

		if (previous_account.has_some())
			return Result.fail("An account with the same email already exist")

		account.hash_password()

		account.dispatch_event(new AccountCreatedEvent(account.id))

		await this.account_repo.register(account)

		return Result.ok(Unit)
	}
}
