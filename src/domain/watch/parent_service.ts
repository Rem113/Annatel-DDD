import IParentRepository from "./i_parent_repository"
import { Maybe } from "../core/maybe"
import {
	SubscribeToFailure,
	InvalidWatchDataFailure,
	UnsubscribeFromFailure,
	ParentNotFoundFailure,
	DefineGeofenceForFailure,
	GeofencesForFailure,
	SubscriptionsFailure,
} from "./parent_failures"
import { Serial } from "./serial.vo"
import IWatchRepository from "./i_watch_repository"
import { UniqueId } from "../core/entity"
import { Parent } from "./parent.agg"
import { injectable, inject } from "tsyringe"
import { SubscriptionCreated, SubscriptionCancelled } from "./parent_events"
import { Geofence } from "./geofence.vo"
import Either from "../core/either"
import { build_subscriptions_dto, SubscriptionsDTO } from "./parent_dtos"

@injectable()
export class ParentService {
	private readonly parent_repo: IParentRepository
	private readonly watch_repo: IWatchRepository

	constructor(
		@inject("IParentRepository") parent_repo: IParentRepository,
		@inject("IWatchRepository") watch_repo: IWatchRepository
	) {
		this.parent_repo = parent_repo
		this.watch_repo = watch_repo
	}

	async subscribe_to(
		serial: Serial,
		vendor: string,
		account: UniqueId
	): Promise<Maybe<SubscribeToFailure>> {
		// Find the watch
		const maybe_watch = await this.watch_repo.with_serial_and_vendor(
			serial,
			vendor
		)

		if (maybe_watch.is_none()) return Maybe.some(new InvalidWatchDataFailure())

		const watch = maybe_watch.get_val()

		const maybe_parent = await this.parent_repo.with_account(account)

		let parent: Parent

		if (maybe_parent.has_some()) parent = maybe_parent.get_val()
		else {
			parent = Parent.create({
				account,
				subscriptions: [],
			}).get_val()
		}

		const added = parent.subscribe_to(watch.id)

		if (added) {
			parent.dispatch_event(new SubscriptionCreated(parent.id))
			await this.parent_repo.save(parent)
		}

		return Maybe.none()
	}

	async unsubscribe_from(
		serial: Serial,
		vendor: string,
		account: UniqueId
	): Promise<Maybe<UnsubscribeFromFailure>> {
		// Find the watch
		const maybe_watch = await this.watch_repo.with_serial_and_vendor(
			serial,
			vendor
		)

		if (maybe_watch.is_none()) return Maybe.some(new InvalidWatchDataFailure())

		const watch = maybe_watch.get_val()

		const maybe_parent = await this.parent_repo.with_account(account)

		if (maybe_parent.is_none()) return Maybe.some(new ParentNotFoundFailure())

		const parent = maybe_parent.get_val()

		const removed = parent.unsubscribe_from(watch.id)

		if (removed) {
			parent.dispatch_event(new SubscriptionCancelled(parent.id))

			await this.parent_repo.save(parent)
		}

		return Maybe.none()
	}

	async define_geofence_for(
		serial: Serial,
		vendor: string,
		geofence: Geofence,
		account: UniqueId
	): Promise<Maybe<DefineGeofenceForFailure>> {
		// Find the watch
		const maybe_watch = await this.watch_repo.with_serial_and_vendor(
			serial,
			vendor
		)

		if (maybe_watch.is_none()) return Maybe.some(new InvalidWatchDataFailure())

		const watch = maybe_watch.get_val()

		const maybe_parent = await this.parent_repo.with_account(account)

		let parent: Parent

		if (maybe_parent.has_some()) parent = maybe_parent.get_val()
		else {
			parent = Parent.create({
				account,
				subscriptions: [],
			}).get_val()
		}

		const defined = parent.define_geofence_for(watch.id, geofence)

		console.log(defined)

		if (defined) {
			// Fire an event (eventually (lol))
			this.parent_repo.save(parent)
		}

		return Maybe.none()
	}

	async subscriptions(
		account: UniqueId
	): Promise<Either<SubscriptionsFailure, SubscriptionsDTO>> {
		const maybe_parent = await this.parent_repo.with_account(account)

		if (maybe_parent.is_none()) return Either.left(new ParentNotFoundFailure())

		const parent = maybe_parent.get_val()

		return Either.right(build_subscriptions_dto(parent.subscriptions))
	}
}
