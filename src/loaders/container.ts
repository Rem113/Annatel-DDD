import { container } from "tsyringe"
import { AccountRepository } from "../data/auth/account_repository"
import { AccountModel } from "../data/auth/account_model"

export default () => {
	container.register("IAccountRepository", {
		useClass: AccountRepository,
	})

	container.register("IAccountModel", { useValue: AccountModel })
}
