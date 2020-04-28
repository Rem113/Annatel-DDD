import { shallowEqual } from "shallow-equal-object"

export interface ValueObjectProps {
	[index: string]: any
}

export abstract class ValueObject<T extends ValueObjectProps> {
	protected readonly value: T

	protected constructor(value: T) {
		this.value = value
	}

	public equals(other: ValueObject<T>): boolean {
		if (other === null || other === undefined) return false
		return shallowEqual(this.value, other.value)
	}
}
