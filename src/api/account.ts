import { Router } from "express"
import { container } from "tsyringe"
import { AccountService } from "../domain/auth/account_service"
import {
	InvalidInput,
	EmailExists,
	AccountCreationFailed,
} from "../domain/auth/register/register.failures"

export default () => {
	const router = Router()

	const account_service = container.resolve(AccountService)

	router.post("/register", async (req, res) => {
		const { email, password } = req.body

		const result = await account_service.register(email, password)

		return result.fold(
			(err) => {
				switch (err.constructor) {
					case InvalidInput:
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
