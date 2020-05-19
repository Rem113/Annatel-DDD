import { IAccountRepository } from "./i_account_repository"
import { Account } from "./account.agg"
import { Email } from "./email.vo"
import { injectable, inject } from "tsyringe"
import { Password } from "./password.vo"
import Either from "../core/either"
import {
	RegisterFailure,
	EmailExists,
	AccountCreationFailed,
	LoginFailure,
	EmailDoesNotExist,
	InvalidInput,
} from "./account_failures"
import { DomainEventsDispatcher } from "../core/domain_events"
import { AccountCreated, AccountLogin } from "./account_events"
import { RegisterDTO, LoginDTO } from "./account_dtos"

@injectable()
export class AccountService {
	private readonly account_repo: IAccountRepository

	constructor(@inject("IAccountRepository") account_repo: IAccountRepository) {
		this.account_repo = account_repo
	}

	async register(
		email_val: string,
		password_val: string
	): Promise<Either<RegisterFailure, RegisterDTO>> {
		let email, password

		try {
			email = Email.create({ email: email_val })
			password = Password.create({ password: password_val })
		} catch (err) {
			return Either.left(new InvalidInput(err))
		}

		// Checks that email is available
		const previous_account = await this.account_repo.with_email(email)

		if (previous_account.has_some()) return Either.left(new EmailExists())

		// Create account
		const account_vo = Account.create({
			email,
			password,
		})

		if (account_vo.is_err()) return Either.left(new AccountCreationFailed())

		const account = account_vo.get_val()

		account.dispatch_event(new AccountCreated(account.id))

		await this.account_repo.save(account)

		return Either.right({
			id: account.id.to_string(),
			email: account.email,
		})
	}

	async login(
		email_val: string,
		password_val: string
	): Promise<Either<LoginFailure, LoginDTO>> {
		let email, password

		try {
			email = Email.create({ email: email_val })
			password = Password.create({ password: password_val })
		} catch (err) {
			return Either.left(new InvalidInput(err))
		}

		// Check that the email exists
		const maybe_account = await this.account_repo.with_email(email)

		if (!maybe_account.has_some()) return Either.left(new EmailDoesNotExist())

		const account = maybe_account.get_val()

		// Compare password hashes
		const password_is_valid = password.compare_hash(account.password_hash)

		if (!password_is_valid)
			return Either.left(new InvalidInput("Password is invalid"))

		account.dispatch_event(new AccountLogin(account.id))
		DomainEventsDispatcher.dispatch_events_for_aggregate(account.id)

		const token = account.generate_token()
		return Either.right({ token })
	}
}
