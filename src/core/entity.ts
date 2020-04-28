import { v4 as uuid } from "uuid"

export class UniqueId {
	private readonly value: string

	constructor(id?: string) {
		this.value = id ? id : uuid()
	}

	equals(other: UniqueId) {
		if (other === undefined || other === null) return false
		return this.value === other.value
	}
}

export interface EntityProps {
	[index: string]: any
}

export abstract class Entity<T extends EntityProps> {
	private readonly props: T
	private readonly id: UniqueId

	constructor(props: T, id?: string) {
		this.props = props
		this.id = new UniqueId(id)
	}

	equals(other: Entity<T>): boolean {
		if (other === undefined || other === null) return false
		return this.id.equals(other.id)
	}
}
