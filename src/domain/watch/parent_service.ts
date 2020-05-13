import IParentRepository from "./i_parent_repository"
import { Maybe } from "../core/maybe"
import {
	SubscribeToFailure,
	InvalidWatchDataFailure,
	UnsubscribeFromFailure,
	ParentNotFoundFailure,
} from "./parent_failures"
import { Serial } from "./serial.vo"
import IWatchRepository from "./i_watch_repository"
import { Watch } from "./watch.agg"
import { WatchCreated } from "./watch_events"
import { UniqueId } from "../core/entity"
import { Parent } from "./parent.agg"
import { Subscription } from "./subscription.e"
import { injectable, inject } from "tsyringe"
import { SubscriptionCreated, SubscriptionCancelled } from "./parent_events"

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
}
