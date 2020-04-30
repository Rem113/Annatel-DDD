import { Router } from "express"
import { container } from "tsyringe"
import { AccountService } from "../domain/auth/account_service"
import {
	InvalidInput,
	EmailExists,
} from "../domain/auth/register/register.failures"

export default () => {
	const router = Router()

	const account_service = container.resolve(AccountService)

	router.post("/register", async (req, res) => {
		const { email, password } = req.body

		const result = await account_service.register(email, password)

		return result.fold(
			(err) => {
				if (err instanceof InvalidInput || err instanceof EmailExists) {
					return res.status(400).json(err.unwrap())
				} else {
					return res.status(500).json(err.unwrap())
				}
			},
			(register_info) => res.status(201).json(register_info)
		)
	})

	return router
}
