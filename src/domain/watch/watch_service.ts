import { injectable, inject } from "tsyringe"
import {
	PostMessageFailure,
	InvalidWatchDataFailure,
	ReadMessagesOfFailure,
	GetLocationOfFailure,
	NoLocationDataFailure,
} from "./watch_failures"
import { MessagePosted, WatchCreated, LocationUpdated } from "./watch_events"
import { Message, MessageType } from "./message.vo"
import { Serial } from "./serial.vo"
import { Watch } from "./watch.agg"
import IWatchRepository from "./i_watch_repository"
import Either from "../core/either"
import { Unit } from "../core/result"
import { Location } from "./location.vo"

@injectable()
export class WatchService {
	private readonly watch_repo: IWatchRepository

	constructor(@inject("IWatchRepository") watch_repo: IWatchRepository) {
		this.watch_repo = watch_repo
	}

	async post_message(
		message: Message,
		serial: Serial,
		vendor: string
	): Promise<Either<PostMessageFailure, Unit>> {
		// Find the addressed watch
		const maybe_watch = await this.watch_repo.with_serial_and_vendor(
			serial,
			vendor
		)

		let watch: Watch

		if (maybe_watch.has_some()) watch = maybe_watch.get_val()
		else {
			// If it does not exist, create it
			const result_watch = Watch.create({
				serial,
				vendor,
				messages: [],
			})

			if (result_watch.is_err())
				return Either.left(new InvalidWatchDataFailure())

			watch = result_watch.get_val()

			watch.dispatch_event(new WatchCreated(watch.id))
		}

		// Post the message, then save the watch's state
		watch.post_message(message)

		this.watch_repo.save(watch)

		// Notify
		watch.dispatch_event(new MessagePosted(watch.id))

		if (message.type === MessageType.UD)
			watch.dispatch_event(new LocationUpdated(watch.id))

		return Either.right(Unit)
	}

	async read_messages_of(
		serial: Serial,
		vendor: string
	): Promise<Either<ReadMessagesOfFailure, Message[]>> {
		// Get the watch
		const maybe_watch = await this.watch_repo.with_serial_and_vendor(
			serial,
			vendor
		)

		if (maybe_watch.is_none()) return Either.left(new InvalidWatchDataFailure())
		return Either.right(maybe_watch.get_val().messages)
	}

	async get_location_of(
		serial: Serial,
		vendor: string
	): Promise<Either<GetLocationOfFailure, Location>> {
		// Get the watch
		const maybe_watch = await this.watch_repo.with_serial_and_vendor(
			serial,
			vendor
		)

		if (maybe_watch.is_none()) return Either.left(new InvalidWatchDataFailure())

		const location = maybe_watch.get_val().location

		if (location === null) return Either.left(new NoLocationDataFailure())

		return Either.right(location)
	}
}
