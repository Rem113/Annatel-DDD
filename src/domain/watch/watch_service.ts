import { injectable, inject } from "tsyringe"
import {
	InvalidMessage,
	InvalidInput,
	PostMessageFailure,
} from "./watch_failures"
import { MessagePosted, WatchCreated } from "./watch_events"
import { MessageType, Message } from "./message_vo"
import { Serial } from "./serial.vo"
import { Watch } from "./watch.agg"
import IWatchRepository from "./i_watch_repository"
import Either from "../core/either"
import Failure from "../core/failure"
import { Unit } from "../core/result"

@injectable()
export class WatchService {
	private readonly watch_repo: IWatchRepository

	constructor(@inject("IWatchRepository") watch_repo: IWatchRepository) {
		this.watch_repo = watch_repo
	}

	async post_message(
		serial: string,
		vendor: string,
		type: MessageType,
		length: number,
		payload?: any
	): Promise<Either<PostMessageFailure, Unit>> {
		// Create the message
		const message = Message.create({ type, length, payload })

		if (message.is_err())
			return Either.left(new InvalidMessage(message.get_err()!))

		// Find the addressed watch
		const serial_vo = Serial.create({ serial })

		if (serial_vo.is_err())
			return Either.left(new InvalidInput(serial_vo.get_err() as string))

		const maybe_watch = await this.watch_repo.with_serial_and_vendor(
			serial_vo.get_val(),
			vendor
		)

		let watch: Watch

		if (maybe_watch.has_some()) watch = maybe_watch.get_val()
		else {
			const result_watch = Watch.create({
				serial: serial_vo.get_val(),
				vendor,
				messages: [],
			})

			if (result_watch.is_err())
				return Either.left(new InvalidInput(result_watch.get_err() as string))

			watch = result_watch.get_val()

			watch.dispatch_event(new WatchCreated(watch.id))
		}

		// Post the message, then save the watch's state
		watch.post_message(message.get_val())

		this.watch_repo.save(watch)

		// Notify
		watch.dispatch_event(new MessagePosted(watch.id))

		return Either.right(Unit)
	}
}
