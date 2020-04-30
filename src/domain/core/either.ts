enum Direction {
	LEFT,
	RIGHT,
}

export default abstract class Either<L, R> {
	private readonly value: L | R
	private readonly direction: Direction

	protected constructor(value: L | R, direction: Direction) {
		this.value = value
		this.direction = direction
	}

	static right<L, R>(value: R): Either<L, R> {
		return new Right(value)
	}

	static left<L, R>(value: L): Either<L, R> {
		return new Left(value)
	}

	fold(func_left: (left: L) => any, func_right: (right: R) => any): any {
		if (this.direction === Direction.LEFT) return func_left(this.value as L)
		return func_right(this.value as R)
	}

	get_left(): L {
		if (this.direction === Direction.RIGHT)
			throw new Error("InvalidOperation: Can't get left of right")
		return this.value as L
	}

	get_right(): R {
		if (this.direction === Direction.LEFT)
			throw new Error("InvalidOperation: Can't get right of left")
		return this.value as R
	}

	is_left(): boolean {
		return this.direction === Direction.LEFT
	}

	is_right(): boolean {
		return this.direction === Direction.RIGHT
	}
}

class Left<L, R> extends Either<L, R> {
	constructor(value: L) {
		super(value, Direction.LEFT)
	}
}

class Right<L, R> extends Either<L, R> {
	constructor(value: R) {
		super(value, Direction.RIGHT)
	}
}
