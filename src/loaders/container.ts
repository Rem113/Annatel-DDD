import { container } from "tsyringe"
import { AccountRepository } from "../data/account/account_repository"
import { AccountModel } from "../data/account/account_model"

export default () => {
	container.register("IAccountRepository", {
		useClass: AccountRepository,
	})

	container.register("IAccountModel", { useValue: AccountModel })
}
