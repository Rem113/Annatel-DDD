import Failure from "../core/failure"

export type PostMessageFailure = InvalidWatchDataFailure
export type ReadMessagesOfFailure = InvalidWatchDataFailure
export type GetLocationOfFailure =
	| InvalidWatchDataFailure
	| NoLocationDataFailure

export class InvalidWatchDataFailure extends Failure {}

export class NoLocationDataFailure extends Failure {}
