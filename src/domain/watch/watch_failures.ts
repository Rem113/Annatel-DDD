import Failure from "../core/failure"

export type PostMessageFailure = InvalidWatchDataFailure
export type ReadMessagesOfFailure = InvalidWatchDataFailure
export type GetLocationOfFailure =
	| InvalidWatchDataFailure
	| NoLocationDataFailure

export class InvalidWatchDataFailure extends Failure {
	constructor() {
		super("Invalid watch data")
	}
}

export class NoLocationDataFailure extends Failure {
	constructor() {
		super("No location data for this watch")
	}
}
