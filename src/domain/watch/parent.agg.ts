import { EntityProps, UniqueId } from "../core/entity"
import { AggregateRoot } from "../core/aggregate_root"
import { Subscription } from "./subscription.e"
import { Geofence } from "./geofence.vo"
import Either from "../core/either"
import { Maybe } from "../core/maybe"

export interface ParentProps extends EntityProps {
  account: UniqueId
  subscriptions: Subscription[]
  inserted_at?: Date
  updated_at?: Date
}

export class Parent extends AggregateRoot<ParentProps> {
  static create(props: ParentProps): Parent {
    return new Parent(props)
  }

  define_geofence_for(watch: UniqueId, geofence: Geofence): boolean {
    const subscription = this.subscriptions.filter((s) =>
      s.watch.equals(watch)
    )[0]

    if (!subscription) return false

    return subscription.define_geofence(geofence)
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
  subscribe_to(watch: UniqueId, name: String): Maybe<string> {
    const exists = this.props.subscriptions.some((s) => s.watch.equals(watch))

    if (exists) return Maybe.some("The subscription already exist")

    if (!name) return Maybe.some("Please provide a name for the subscription")

    this.props.subscriptions.unshift(
      Subscription.create({
        watch,
        name,
        geofences: [],
      })
    )

    return Maybe.none()
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

  geofences_for(watch: UniqueId): Geofence[] {
    return (
      this.subscriptions.find((s) => s.watch.equals(watch))?.geofences ?? []
    )
  }
}
