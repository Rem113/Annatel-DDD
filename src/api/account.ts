import { Router } from "express"
import { container } from "tsyringe"
import { AccountService } from "../domain/account/account_service"
import {
  EmailExists,
  AccountCreationFailed,
  EmailDoesNotExist,
  InvalidInput,
} from "../domain/account/account_failures"

export default () => {
  const router = Router()

  const account_service = container.resolve(AccountService)

  router.post("/token", async (req, res) => {
    const { email, password } = req.body

    const result = await account_service.login(email, password)

    return result.fold(
      (err) => {
        switch (err.constructor) {
          case InvalidInput:
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

  router.post("/", async (req, res) => {
    const { email, password } = req.body

    const result = await account_service.register(email, password)

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
