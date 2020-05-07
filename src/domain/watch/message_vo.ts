import { ValueObjectProps, ValueObject } from "../core/value_object"
import Result from "../core/result"
import { Serial } from "./serial.vo"

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

export interface MessageProps extends ValueObjectProps {
	type: MessageType
	length: number
	payload?: any
}

export class Message extends ValueObject<MessageProps> {
	static create(props: MessageProps): Result<Message> {
		return Result.ok(new Message(props))
	}

	get length(): number {
		return this.value.length
	}

	get type(): MessageType {
		return this.value.type
	}

	get payload(): any {
		return this.value.payload
	}
}
