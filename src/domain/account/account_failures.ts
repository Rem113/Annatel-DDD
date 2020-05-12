import Failure from "../core/failure"

export type RegisterFailure = EmailExists | AccountCreationFailed
export type LoginFailure = EmailDoesNotExist | InvalidPassword

export class EmailDoesNotExist extends Failure {
	constructor() {
		super("Email does not exist")
	}
}

export class InvalidPassword extends Failure {
	constructor() {
		super("Password is invalid")
	}
}

export class EmailExists extends Failure {
	constructor() {
		super("Email already exist")
	}
}

export class AccountCreationFailed extends Failure {
	constructor() {
		super("Couldn't create the account")
	}
}
