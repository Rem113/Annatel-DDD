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
	[index: string]: any
}

export abstract class Entity<T extends EntityProps> {
	protected readonly props: T
	protected readonly _id: UniqueId

	constructor(props: T, id?: UniqueId) {
		this.props = props
		this._id = id ?? new UniqueId()
	}

	equals(other: Entity<T>): boolean {
		if (other === undefined || other === null) return false
		return this._id.equals(other._id)
	}
}
