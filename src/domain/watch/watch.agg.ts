import { AggregateRoot } from "../core/aggregate_root"
import { EntityProps } from "../core/entity"
import Result from "../core/result"
import { Message } from "./message_vo"

export interface WatchProps extends EntityProps {
	serial: string
	vendor: string
	inserted_at?: Date
	updated_at?: Date
	messages: Message[]
}

export class Watch extends AggregateRoot<WatchProps> {
	static create(props: WatchProps): Result<Watch> {
		if (props.serial.length !== 9)
			return Result.fail("Serial number must be 9 characters")
		return Result.ok(new Watch(props))
	}
}
