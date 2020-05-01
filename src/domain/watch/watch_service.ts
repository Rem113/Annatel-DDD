import { MessageType, Message } from "./message_vo"
import { InvalidMessage } from "./watch_failures"

export class WatchService {
	async post_message(
		type: MessageType,
		length: number,
		payload?: any
	): Promise<any> {
		const message_vo = Message.create({ type, length, payload })

		if (message_vo.is_err()) return new InvalidMessage(message_vo.get_err()!)

		// Save it in the database

		// Dispatch event
	}
}
