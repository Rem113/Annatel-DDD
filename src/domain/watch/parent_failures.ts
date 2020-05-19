import Failure from "../core/failure"

export type SubscribeToFailure = InvalidWatchDataFailure
export type UnsubscribeFromFailure =
	| InvalidWatchDataFailure
	| ParentNotFoundFailure
export type DefineGeofenceForFailure =
	| InvalidWatchDataFailure
	| ParentNotFoundFailure
export type GeofencesForFailure =
	| InvalidWatchDataFailure
	| ParentNotFoundFailure

export type SubscriptionsFailure = ParentNotFoundFailure

export class InvalidWatchDataFailure extends Failure {
	constructor(message?: string) {
		super(message ?? "The watch does not exist")
	}
}

export class ParentNotFoundFailure extends Failure {
	constructor() {
		super("You are not a parent")
	}
}
