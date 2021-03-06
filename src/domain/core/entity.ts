import { v4 as uuid } from "uuid"

export class UniqueId {
	private readonly value: string

	constructor(id?: string) {
		this.value = id ?? uuid()
	}

	equals(other: UniqueId) {
		if (other === undefined || other === null) return false
		return this.value === other.value
	}

	to_string(): string {
		return this.value
	}
}

export interface EntityProps {
	id?: UniqueId
	[index: string]: any
}

export abstract class Entity<T extends EntityProps> {
	protected readonly props: T

	constructor(props: T) {
		this.props = props
		this.props.id = props.id ?? new UniqueId()
	}

	get id(): UniqueId {
		return this.props.id!
	}

	equals(other: Entity<T>): boolean {
		if (other === undefined || other === null) return false
		return this.id.equals(other.id)
	}
}
