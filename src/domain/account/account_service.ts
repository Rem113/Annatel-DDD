import { IAccountRepository } from "./i_account_repository"
import { Account } from "./account.agg"
import { Email } from "./email.vo"
import { injectable, inject } from "tsyringe"
import { Password } from "./password.vo"
import Either from "../core/either"
import Result from "../core/result"
import {
	RegisterFailure,
	InvalidInput,
	EmailExists,
	AccountCreationFailed,
	LoginFailure,
	EmailDoesNotExist,
	InvalidPassword,
} from "./account_failures"
import { DomainEventsDispatcher } from "../core/domain_events"
import { AccountCreatedEvent, AccountLogin } from "./account_events"
import { RegisterDTO, LoginDTO } from "./account_dtos"

@injectable()
export class AccountService {
	private readonly account_repo: IAccountRepository

	constructor(@inject("IAccountRepository") account_repo: IAccountRepository) {
		this.account_repo = account_repo
	}

	async register(
		email: string,
		password: string
	): Promise<Either<RegisterFailure, RegisterDTO>> {
		// Validate input
		const email_vo = Email.create({ email })
		const password_vo = Password.create({ password, hashed: false })

		if (!Result.are_ok([email_vo, password_vo]))
			return Either.left(
				new InvalidInput({
					email: email_vo.get_err()!,
					password: password_vo.get_err()!,
				})
			)

		// Checks that email is available
		const previous_account = await this.account_repo.with_email(
			email_vo.get_val()
		)

		if (previous_account.has_some()) return Either.left(new EmailExists())

		// Create account
		const account_vo = Account.create({
			email: email_vo.get_val(),
			password: password_vo.get_val(),
		})

		if (account_vo.is_err()) return Either.left(new AccountCreationFailed())

		const account = account_vo.get_val()

		account.dispatch_event(new AccountCreatedEvent(account.id))

		await this.account_repo.save(account)

		return Either.right({
			id: account.id.to_string(),
			email: account.email,
		})
	}

	async login(
		email: string,
		password: string
	): Promise<Either<LoginFailure, LoginDTO>> {
		// Validate input
		const email_vo = Email.create({ email })
		const password_vo = Password.create({ password, hashed: false })

		if (!Result.are_ok([email_vo, password_vo]))
			return Either.left(
				new InvalidInput({
					email: email_vo.get_err()!,
					password: password_vo.get_err()!,
				})
			)

		// Check that the email exists
		const maybe_account = await this.account_repo.with_email(email_vo.get_val())

		if (!maybe_account.has_some()) return Either.left(new EmailDoesNotExist())

		const account = maybe_account.get_val()

		// Compare password hashes
		const password_is_valid = password_vo
			.get_val()
			.compare_hash(account.password_hash)

		if (!password_is_valid) return Either.left(new InvalidPassword())

		account.dispatch_event(new AccountLogin(account.id))
		DomainEventsDispatcher.dispatch_events_for_aggregate(account.id)

		const token = account.generate_token()
		return Either.right({ token })
	}
}
