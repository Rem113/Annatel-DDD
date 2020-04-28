import { DomainEvent, AggregateRoot } from "./aggregate_root"
import { UniqueId } from "./entity"

type DomainEventHandler = (event: DomainEvent) => void

export class DomainEventsDispatcher {
	private static handlers: Map<string, DomainEventHandler[]> = new Map()
	private static dirty_aggregates: AggregateRoot<any>[] = []

	static register_handler(
		event_class_name: string,
		handler: DomainEventHandler
	) {
		this.handlers.get(event_class_name)?.push(handler)
	}

	static mark_dirty_aggregate(aggregate: AggregateRoot<any>) {
		if (!this.dirty_aggregates.some((agg) => agg.id === aggregate.id))
			this.dirty_aggregates.push(aggregate)
	}

	static dispatch_events_for_aggregate(agg_id: UniqueId) {
		const aggregate = this.dirty_aggregates.find((agg) => agg.id === agg_id)

		if (aggregate) {
			aggregate.events.forEach((event) =>
				this.handlers
					.get(event.constructor.name)
					?.forEach((handler) => handler(event))
			)

			aggregate.clear_domain_events()

			this.dirty_aggregates.splice(
				this.dirty_aggregates.findIndex((agg) => agg.id === aggregate.id),
				1
			)
		}
	}
}
