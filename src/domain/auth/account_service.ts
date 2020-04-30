import { IAccountRepository } from "./i_account_repository"
import { Account } from "./account.e"
import { AccountCreatedEvent } from "./account_created.de"
import { Email } from "./email.vo"
import { injectable, inject } from "tsyringe"
import RegisterDTO from "./register/register.dto"
import { Password } from "./password.vo"
import {
	InvalidInput,
	EmailExists,
	AccountCreationFailed,
} from "./register/register.failures"
import Either from "../core/either"
import Failure from "../core/failure"
import Result from "../core/result"

@injectable()
export class AccountService {
	private readonly account_repo: IAccountRepository

	constructor(@inject("IAccountRepository") account_repo: IAccountRepository) {
		this.account_repo = account_repo
	}

	async register(
		email: string,
		password: string
	): Promise<Either<Failure, RegisterDTO>> {
		const email_vo = Email.create({ email })
		const password_vo = Password.create({ password })

		if (!Result.are_ok([email_vo, password_vo]))
			return Either.left(
				new InvalidInput({
					email: email_vo.get_err()!,
					password: password_vo.get_err()!,
				})
			)

		const previous_account = await this.account_repo.with_email(
			email_vo.get_val()
		)

		if (previous_account.has_some()) return Either.left(new EmailExists())

		const account_vo = Account.create({
			email: email_vo.get_val(),
			password: password_vo.get_val(),
		})

		if (account_vo.is_err()) return Either.left(new AccountCreationFailed())

		const account = account_vo.get_val()

		account.hash_password()

		account.dispatch_event(new AccountCreatedEvent(account.id))

		await this.account_repo.register(account)

		return Either.right({
			id: account.id.to_string(),
			email: account.email,
		})
	}
}
