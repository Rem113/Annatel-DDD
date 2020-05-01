import { Model } from "mongoose"

import { IAccountRepository } from "../../domain/account/i_account_repository"
import { Account } from "../../domain/account/account.agg"
import { Email } from "../../domain/account/email.vo"
import { Maybe } from "../../domain/core/maybe"
import { IAccountDocument } from "./account_model"
import { AccountMapper } from "./account_mapper"
import { injectable, inject } from "tsyringe"

export type IAccountModel = Model<IAccountDocument>

@injectable()
export class AccountRepository implements IAccountRepository {
	private readonly account_model: IAccountModel

	constructor(@inject("IAccountModel") account_model: IAccountModel) {
		this.account_model = account_model
	}

	async with_email(email: Email): Promise<Maybe<Account>> {
		const account = await this.account_model
			.findOne({ email: email.email })
			.exec()
		if (account) return Maybe.some(AccountMapper.from_persistance(account))
		return Maybe.none()
	}

	async register(account: Account): Promise<void> {
		await this.account_model.create(AccountMapper.to_persistance(account))
	}
}
