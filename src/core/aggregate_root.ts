import { Entity, UniqueId } from "./entity"

export interface DomainEvent {
	occured_at: Date
	aggregate_id: UniqueId
}

export abstract class AggregateRoot<T> extends Entity<T> {
	private domain_events: DomainEvent[]

	constructor(props: T, id?: UniqueId) {
		super(props, id)
		this.domain_events = []
	}

	get id(): UniqueId {
		return this.id
	}

	get events(): DomainEvent[] {
		return this.domain_events
	}

	dispatch_event(event: DomainEvent) {
		this.domain_events.push(event)

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
			"==>",
			domain_event_class.constructor.name
		)
	}
}
