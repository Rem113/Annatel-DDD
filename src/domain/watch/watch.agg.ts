import { AggregateRoot } from "../core/aggregate_root"
import { EntityProps } from "../core/entity"
import Result from "../core/result"
import { Message } from "./message_vo"
import { Serial } from "./serial.vo"
import Should from "../core/should"

export interface WatchProps extends EntityProps {
	serial: Serial
	vendor: string
	inserted_at?: Date
	updated_at?: Date
	messages: Message[]
}

export class Watch extends AggregateRoot<WatchProps> {
	static create(props: WatchProps): Result<Watch> {
		const error = Should.not_be_null_or_undefined([
			{
				name: "Vendor",
				value: props.vendor,
			},
			{ name: "Serial", value: props.serial },
		])
		if (error.has_some()) return Result.fail(error.get_val() as string)

		return Result.ok(new Watch(props))
	}

	get serial(): string {
		return this.props.serial.serial
	}

	get vendor(): string {
		return this.props.vendor
	}

	get messages(): Message[] {
		return this.props.messages
	}

	get inserted_at(): Date | undefined {
		return this.props.inserted_at
	}

	get updated_at(): Date | undefined {
		return this.props.updated_at
	}

	post_message(message: Message): void {
		this.props.messages.unshift(message)
	}
}
