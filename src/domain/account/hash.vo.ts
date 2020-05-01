import { ValueObject, ValueObjectProps } from "../core/value_object"
import Result from "../core/result"

export interface HashProps extends ValueObjectProps {
	hash: string
}

export class Hash extends ValueObject<HashProps> {
	static create(props: HashProps): Result<Hash> {
		return Result.ok(new Hash(props))
	}

	get hash(): string {
		return this.value.hash
	}
}
