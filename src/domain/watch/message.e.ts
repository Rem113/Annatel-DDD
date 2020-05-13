import Result from "../core/result"
import Should from "../core/should"
import { EntityProps, Entity } from "../core/entity"

export enum MessageType {
	AL,
	ANY,
	APN,
	BT,
	CALL,
	CENTER,
	CR,
	FACTORY,
	IP,
	LK,
	LOWBAT,
	LZ,
	MONITOR,
	POWEROFF,
	PULSE,
	PW,
	RAD,
	REMOVE,
	RESET,
	RG,
	SLAVE,
	SMS,
	SOS,
	SOS1,
	SOS2,
	SOS3,
	SOSSMS,
	TS,
	UD,
	UD2,
	UPGRADE,
	UPLOAD,
	URL,
	VERNO,
	WAD,
	WG,
	WORK,
	WORKTIME,
}

export interface MessageProps extends EntityProps {
	type: MessageType
	length: number
	payload?: any
	posted_at: Date
}

export class Message extends Entity<MessageProps> {
	static create(props: MessageProps): Result<Message> {
		const error = Should.not_be_null_or_undefined([
			{ name: "Type", value: props.type },
			{ name: "Length", value: props.length },
		])

		if (error.has_some()) return Result.fail(error.get_val() as string)

		if (!Object.values(MessageType).includes(props.type))
			return Result.fail("Please enter a valid message type")

		return Result.ok(new Message(props))
	}

	get length(): number {
		return this.props.length
	}

	get type(): MessageType {
		return this.props.type
	}

	get payload(): any {
		return this.props.payload ?? {}
	}

	get posted_at(): Date {
		return this.props.posted_at
	}
}
