export abstract class Result<T> {
	private readonly value: T | string
	private readonly is_valid: boolean

	constructor(value: T | string, is_valid: boolean) {
		this.value = value
		this.is_valid = is_valid
	}

	static ok<T>(value: T): Result<T> {
		return new Ok(value)
	}

	static fail<T>(error: string): Result<T> {
		return new Err(error)
	}

	static are_ok(results: Result<any>[]): boolean {
		for (const result of results) if (result.is_err()) return false
		return true
	}

	fold(func_err: (error: string) => any, func_ok: (value: T) => any): any {
		if (!this.is_valid) return func_err(this.value as string)
		return func_ok(this.value as T)
	}

	get_val(): T {
		if (!this.is_valid)
			throw new Error("InvalidOperation: Can't get value of invalid result")
		return this.value as T
	}

	get_err(): string | null {
		if (this.is_valid) return null
		return this.value as string
	}

	is_err(): boolean {
		return !this.is_valid
	}

	is_ok(): boolean {
		return this.is_valid
	}
}

export class Err<T> extends Result<T> {
	constructor(error: string) {
		super(error, false)
	}
}

export class Ok<T> extends Result<T> {
	constructor(value: T) {
		super(value, true)
	}
}
