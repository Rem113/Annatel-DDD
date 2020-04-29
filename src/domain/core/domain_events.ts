import { AggregateRoot } from "./aggregate_root"
import { UniqueId } from "./entity"

export type DomainEventHandler = (event: DomainEvent) => void

export abstract class DomainEvent {
	readonly occured_at: Date
	readonly aggregate_id: UniqueId

	constructor(aggregate_id: UniqueId) {
		this.occured_at = new Date()
		this.aggregate_id = aggregate_id
	}
}

export class DomainEventsDispatcher {
	private static handlers: Map<string, DomainEventHandler[]> = new Map()
	private static dirty_aggregates: AggregateRoot<any>[] = []

	static register_handler(
		event_class_name: string,
		handler: DomainEventHandler
	) {
		if (this.handlers.has(event_class_name))
			this.handlers.get(event_class_name)!.push(handler)
		else this.handlers.set(event_class_name, [handler])
	}

	static mark_dirty_aggregate(aggregate: AggregateRoot<any>) {
		if (!this.dirty_aggregates.some((agg) => agg.id === aggregate.id))
			this.dirty_aggregates.push(aggregate)
	}

	static dispatch_events_for_aggregate(agg_id: UniqueId) {
		const aggregate = this.dirty_aggregates.find((agg) => agg.id.equals(agg_id))

		if (!aggregate) return

		// Dispatch events
		aggregate.events.forEach((event) =>
			this.handlers
				.get(event.constructor.name)
				?.forEach((handler) => handler(event))
		)

		aggregate.clear_domain_events()

		// Remove aggregate from dirty array
		this.dirty_aggregates.splice(
			this.dirty_aggregates.findIndex((agg) => agg.id === aggregate.id),
			1
		)
	}
}
