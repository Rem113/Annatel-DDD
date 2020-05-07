import { container } from "tsyringe"
import { AccountRepository } from "../data/account/account_repository"
import AccountModel from "../data/account/account_model"
import WatchRepository from "../data/watch/watch_repository"
import WatchModel from "../data/watch/watch_model"

export default () => {
	container.register("IAccountRepository", {
		useClass: AccountRepository,
	})
	container.register("IAccountModel", { useValue: AccountModel })

	container.register("IWatchRepository", { useClass: WatchRepository })
	container.register("IWatchModel", { useValue: WatchModel })
}
