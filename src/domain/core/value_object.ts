const deep_equal = (a: any, b: any): boolean => {
	return Object.getOwnPropertyNames(a).every((prop) => {
		if (b[prop] === null || b[prop] === undefined) return false
		if (a[prop] instanceof ValueObject) return a[prop].equals(b[prop])
		if (typeof a[prop] === "object") return deep_equal(a[prop], b[prop])
		return a[prop] === b[prop]
	})
}

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
		return deep_equal(this.value, other.value)
	}
}
