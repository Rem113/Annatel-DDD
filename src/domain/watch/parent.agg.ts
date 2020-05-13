import { EntityProps, UniqueId } from "../core/entity"
import { AggregateRoot } from "../core/aggregate_root"
import Result from "../core/result"
import { Subscription } from "./subscription.e"
import { Serial } from "./serial.vo"

export interface ParentProps extends EntityProps {
	account: UniqueId
	subscriptions: Subscription[]
	inserted_at?: Date
	updated_at?: Date
}

export class Parent extends AggregateRoot<ParentProps> {
	static create(props: ParentProps): Result<Parent> {
		return Result.ok(new Parent(props))
	}

	get account(): string {
		return this.props.account.to_string()
	}

	get subscriptions(): Subscription[] {
		return this.props.subscriptions
	}

	get inserted_at(): Date | undefined {
		return this.props.inserted_at
	}

	get updated_at(): Date | undefined {
		return this.props.updated_at
	}

	// Subscribes a parent to a watch
	// Returns true if the subscription is new
	subscribe_to(watch: UniqueId): boolean {
		const exists = this.props.subscriptions.some((s) => s.watch.equals(watch))

		if (exists) return false

		this.props.subscriptions.unshift(
			Subscription.create({
				watch,
				geofences: [],
			}).get_val()
		)

		return true
	}

	// Unsubscribes from a watch
	// Returns true if there was a subscription
	unsubscribe_from(watch: UniqueId): boolean {
		const length = this.props.subscriptions.length

		this.props.subscriptions = this.props.subscriptions.filter(
			(s) => !watch.equals(s.watch)
		)

		return this.props.subscriptions.length !== length
	}
}
