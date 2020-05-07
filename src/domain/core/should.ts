import { Maybe } from "./maybe"

interface Prop {
	name: string
	value: any
}

export default class Should {
	static not_be_null_or_undefined(props: Prop[]): Maybe<String> {
		for (const { name, value } of props)
			if (value === null || value === undefined)
				return Maybe.some(`${name} was null or undefined`)

		return Maybe.none()
	}
}
