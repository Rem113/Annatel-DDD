import Failure from "../../core/failure"

export type RegisterFailure = InvalidInput | EmailExists | AccountCreationFailed

export class InvalidInput extends Failure {
	constructor(payload: { email: string; password: string }) {
		super("Invalid input", payload)
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
