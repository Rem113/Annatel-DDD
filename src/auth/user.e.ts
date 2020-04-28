import { Entity, EntityProps } from "../core/entity"
import { Email } from "./email.vo"
import { Result } from "../core/result"
import { Password } from "./password.vo"

export interface UserProps extends EntityProps {
	email: Email
	password: Password
}

export class User extends Entity<UserProps> {
	static create(props: UserProps): Result<User> {
		return Result.ok<User>(new User(props))
	}
}
