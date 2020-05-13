import { UniqueId, EntityProps, Entity } from "../core/entity"
import { Geofence } from "./geofence.vo"
import Result from "../core/result"
import Should from "../core/should"

export interface SubscriptionProps extends EntityProps {
	watch: UniqueId
	geofences: Geofence[]
}

export class Subscription extends Entity<SubscriptionProps> {
	static create(props: SubscriptionProps): Result<Subscription> {
		const error = Should.not_be_null_or_undefined([
			{ name: "Watch", value: props.watch },
		])

		if (error.has_some()) return Result.fail(error.get_val() as string)

		return Result.ok(new Subscription(props))
	}

	get watch(): UniqueId {
		return this.props.watch
	}

	get geofences(): Geofence[] {
		return this.props.geofences
	}
}
