import { Router } from "express"
import { container } from "tsyringe"
import { AccountService } from "../domain/account/account_service"
import {
	EmailExists,
	AccountCreationFailed,
	InvalidPassword,
	EmailDoesNotExist,
} from "../domain/account/account_failures"
import { Email } from "../domain/account/email.vo"
import { Password } from "../domain/account/password.vo"
import Result from "../domain/core/result"

export default () => {
	const router = Router()

	const account_service = container.resolve(AccountService)

	router.get("/login", async (req, res) => {
		const email = Email.create({ email: req.body.email })
		const password = Password.create({ password: req.body.password })

		if (!Result.are_ok([email, password]))
			return res.status(400).json({
				email: email.get_err(),
				password: password.get_err(),
			})

		const result = await account_service.login(
			email.get_val(),
			password.get_val()
		)

		return result.fold(
			(err) => {
				switch (err.constructor) {
					case InvalidPassword:
						return res.status(400).json(err.unwrap())
					case EmailDoesNotExist:
						return res.status(401).json(err.unwrap())
					default:
						throw new Error(`Unhandled case: ${err.constructor.name}`)
				}
			},
			(dto) => res.status(200).json(dto)
		)
	})

	router.post("/register", async (req, res) => {
		const email = Email.create({ email: req.body.email })
		const password = Password.create({ password: req.body.password })

		if (!Result.are_ok([email, password]))
			return res.status(400).json({
				email: email.get_err(),
				password: password.get_err(),
			})

		const result = await account_service.register(
			email.get_val(),
			password.get_val()
		)

		return result.fold(
			(err) => {
				switch (err.constructor) {
					case EmailExists:
						return res.status(400).json(err.unwrap())
					case AccountCreationFailed:
						return res.status(500).json(err.unwrap())
					default:
						throw new Error(`Unhandled case: ${err}`)
				}
			},
			(register_info) => res.status(201).json(register_info)
		)
	})

	return router
}
