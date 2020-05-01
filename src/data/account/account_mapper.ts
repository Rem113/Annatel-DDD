import { Account } from "../../domain/account/account.agg"
import { IAccountDocument } from "./account_model"
import { Email } from "../../domain/account/email.vo"
import { Hash } from "../../domain/account/hash.vo"
import { UniqueId } from "../../domain/core/entity"

export class AccountMapper {
	static to_persistance(account: Account): any {
		return {
			_id: account.id.to_string(),
			email: account.email,
			password: account.password_hash,
		}
	}

	static from_persistance(document: IAccountDocument): Account {
		const account = {
			id: new UniqueId(document._id),
			email: Email.create({ email: document.email }).get_val(),
			password: Hash.create({ hash: document.password }).get_val(),
			inserted_at: document.inserted_at,
			updated_at: document.updated_at,
		}

		return Account.create(account).get_val()
	}
}
