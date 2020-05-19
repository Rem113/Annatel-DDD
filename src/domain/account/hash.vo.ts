import { ValueObject, ValueObjectProps } from "../core/value_object"

export interface HashProps extends ValueObjectProps {
	hash: string
}

export class Hash extends ValueObject<HashProps> {
	static create(props: HashProps): Hash {
		return new Hash(props)
	}

	get hash(): string {
		return this.value.hash
	}
}
