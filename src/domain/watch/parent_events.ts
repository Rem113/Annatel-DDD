import { DomainEvent } from "../core/domain_events"

export class SubscriptionCreated extends DomainEvent {}
export class SubscriptionCancelled extends DomainEvent {}
