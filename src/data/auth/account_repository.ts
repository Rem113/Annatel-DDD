import { Model } from "mongoose"

import {
	IAccountRepository,
	IAccount,
} from "../../domain/auth/i_account_repository"
import { Account } from "../../domain/auth/account.e"
import { Email } from "../../domain/auth/email.vo"
import { Maybe } from "../../domain/core/maybe"
import { IAccountDocument } from "./account_model"
import { AccountMapper } from "./account_mapper"

export class AccountRepository implements IAccountRepository {
	private readonly account_model: Model<IAccountDocument>

	constructor(account_model: Model<IAccountDocument>) {
		this.account_model = account_model
	}

	async with_email(email: Email): Promise<Maybe<IAccount>> {
		const account = await this.account_model
			.findOne({ email: email.email })
			.exec()
		if (account) return Maybe.some(account)
		return Maybe.none()
	}

	async register(account: Account): Promise<void> {
		await this.account_model.create(AccountMapper.to_persistance(account))
	}
}
