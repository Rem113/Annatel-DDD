import { UniqueId, EntityProps, Entity } from "../core/entity"
import { Geofence } from "./geofence.vo"
import Should from "../core/should"

export interface SubscriptionProps extends EntityProps {
	watch: UniqueId
	geofences: Geofence[]
}

export class Subscription extends Entity<SubscriptionProps> {
	static create(props: SubscriptionProps): Subscription {
		const error = Should.not_be_null_or_undefined([
			{ name: "Watch", value: props.watch },
		])

		if (error.has_some()) throw error.get_val()

		return new Subscription(props)
	}

	define_geofence(geofence: Geofence): boolean {
		if (this.geofences.some((g) => g.equals(geofence))) return false
		this.props.geofences.unshift(geofence)
		return true
	}

	get watch(): UniqueId {
		return this.props.watch
	}

	get geofences(): Geofence[] {
		return this.props.geofences
	}
}
