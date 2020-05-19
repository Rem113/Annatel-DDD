import { Account } from "../../domain/account/account.agg"
import AccountModel, { IAccountDocument } from "./account_model"
import { Email } from "../../domain/account/email.vo"
import { Hash } from "../../domain/account/hash.vo"
import { UniqueId } from "../../domain/core/entity"

export class AccountMapper {
	static to_persistance(account: Account): IAccountDocument {
		return new AccountModel({
			_id: account.id.to_string(),
			email: account.email,
			password: account.password_hash,
			inserted_at: account.inserted_at,
			updated_at: account.updated_at,
		})
	}

	static from_persistance(document: IAccountDocument): Account {
		const account = {
			id: new UniqueId(document.id),
			email: Email.create({ email: document.email }),
			password: Hash.create({ hash: document.password }),
			inserted_at: document.inserted_at,
			updated_at: document.updated_at,
		}

		return Account.create(account).get_val()
	}
}
