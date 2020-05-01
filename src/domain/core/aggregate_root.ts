import { Entity, UniqueId } from "./entity"
import { DomainEvent, DomainEventsDispatcher } from "./domain_events"

export abstract class AggregateRoot<T> extends Entity<T> {
	private domain_events: DomainEvent[]

	constructor(props: T) {
		super(props)
		this.domain_events = []
	}

	get id(): UniqueId {
		return this._id
	}

	get events(): DomainEvent[] {
		return this.domain_events
	}

	dispatch_event(event: DomainEvent) {
		this.domain_events.push(event)

		DomainEventsDispatcher.mark_dirty_aggregate(this)

		this.log_event(event)
	}

	clear_domain_events() {
		this.domain_events = []
	}

	private log_event(event: DomainEvent) {
		const this_class = Reflect.getPrototypeOf(this)
		const domain_event_class = Reflect.getPrototypeOf(event)
		console.info(
			"[Domain Event Created]:",
			this_class.constructor.name,
			"#",
			this._id.to_string(),
			"==>",
			domain_event_class.constructor.name
		)
	}
}
