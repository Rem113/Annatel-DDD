import { AggregateRoot } from "../core/aggregate_root"
import { EntityProps } from "../core/entity"
import Result from "../core/result"
import { Message } from "./message_vo"
import { Serial } from "./serial.vo"

export interface WatchProps extends EntityProps {
	serial: Serial
	vendor: string
	inserted_at?: Date
	updated_at?: Date
	messages: Message[]
}

export class Watch extends AggregateRoot<WatchProps> {
	static create(props: WatchProps): Result<Watch> {
		if (props.vendor === null || props.vendor === undefined)
			return Result.fail("Please specify a vendor")
		if (props.serial === null || props.serial === undefined)
			return Result.fail("Please specify a serial")
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
