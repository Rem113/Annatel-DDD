import Failure from "../core/failure"

export type PostMessageFailure = InvalidMessage | InvalidInput

export class InvalidMessage extends Failure {}

export class InvalidInput extends Failure {}
