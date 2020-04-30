import "reflect-metadata"

import load from "./loaders"
import { Email } from "./domain/auth/email.vo"
import { Password } from "./domain/auth/password.vo"
import { Account } from "./domain/auth/account.e"
import { AccountService } from "./domain/auth/account_service"
import { DomainEventsDispatcher } from "./domain/core/domain_events"
import { AccountCreatedEvent } from "./domain/auth/account_created.de"
import { Result } from "./domain/core/result"
import { container } from "tsyringe"

const main = async () => {
	await load()

	DomainEventsDispatcher.register_handler(AccountCreatedEvent.name, (event) =>
		console.log(event.occured_at)
	)

	const email = Email.create({ email: "remi.saal@gmail.com" })
	const password = Password.create({ password: "remiremi98" })

	if (!Result.are_ok([email, password])) {
		throw {
			email: email.get_err(),
			password: password.get_err(),
		}
	}

	Account.create({
		email: email.get_val(),
		password: password.get_val(),
	}).fold(
		(err) => {
			console.error(err)
		},
		async (account) => {
			account.hash_password()

			const account_service = container.resolve(AccountService)

			const result = await account_service.register(account)
			result.fold(
				(err) => {
					console.error(err)
				},
				() => {
					console.log("Account created!")
				}
			)
		}
	)
}

main().catch((err) => console.error(err))
