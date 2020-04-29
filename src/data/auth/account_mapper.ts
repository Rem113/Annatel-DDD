import { Account } from "../../domain/auth/account.e"

export class AccountMapper {
	static to_persistance(account: Account): any {
		return {
			_id: account.id.to_string(),
			email: account.email,
			password: account.password,
		}
	}
}
