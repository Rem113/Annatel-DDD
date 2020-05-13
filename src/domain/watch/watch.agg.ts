import { AggregateRoot } from "../core/aggregate_root"
import { EntityProps } from "../core/entity"
import Result from "../core/result"
import { Message, MessageType } from "./message.e"
import { Serial } from "./serial.vo"
import Should from "../core/should"
import { LocationUpdate } from "./location_update.vo"

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

	get location(): LocationUpdate | null {
		// No messages
		if (this.messages.length === 0) return null
		// No update message
		if (!this.messages.some((message) => message.type === MessageType.UD))
			return null
		// Get last UD message
		const last_update_message = this.messages
			.filter((message) => message.type === MessageType.UD)
			.reduce((m1, m2) => (m1.posted_at > m2.posted_at ? m1 : m2))
		return LocationUpdate.create({
			longitude: last_update_message.payload.longitude,
			latitude: last_update_message.payload.latitude,
			last_update: last_update_message.posted_at,
		}).get_val()
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

	get inserted_at(): Date | null {
		return this.props.inserted_at ?? null
	}

	get updated_at(): Date | null {
		return this.props.updated_at ?? null
	}

	post_message(message: Message): void {
		this.props.messages.unshift(message)
	}
}
