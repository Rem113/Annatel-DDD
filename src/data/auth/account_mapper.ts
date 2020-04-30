import { Account } from "../../domain/auth/account.e"
import { IAccountDocument } from "./account_model"
import { Email } from "../../domain/auth/email.vo"
import { Hash } from "../../domain/auth/hash.vo"
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
		}

		return Account.create(account).get_val()
	}
}
