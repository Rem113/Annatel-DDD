export class Maybe<T> {
	private readonly has: boolean
	private readonly value?: T

	protected constructor(has: boolean, value?: T) {
		this.has = has
		this.value = value
	}

	static some<T>(value: T): Maybe<T> {
		return new Some(value)
	}

	static none<T>(): Maybe<T> {
		return new None()
	}

	map<R>(func: (val: T) => R): Maybe<R> {
		if (this.has) return new Some(func(this.value as T))
		return new None()
	}

	fold(func_some: (val: T) => any, func_none: () => any): any {
		if (this.has) return func_some(this.value as T)
		return func_none()
	}

	get_val(): T {
		if (!this.has) throw new Error("InvalidOperation: Can't get value of None")
		return this.value as T
	}

	has_some(): boolean {
		return this.has
	}

	is_none(): boolean {
		return !this.has
	}
}

class Some<T> extends Maybe<T> {
	constructor(value: T) {
		super(true, value)
	}
}

class None<T> extends Maybe<T> {
	constructor() {
		super(false)
	}
}
