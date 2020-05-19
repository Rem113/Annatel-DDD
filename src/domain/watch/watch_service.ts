import { injectable, inject } from "tsyringe"
import {
	PostMessageFailure,
	InvalidWatchDataFailure,
	ReadMessagesOfFailure,
	GetLocationOfFailure,
	NoLocationDataFailure,
} from "./watch_failures"
import { MessagePosted, WatchCreated, LocationUpdated } from "./watch_events"
import { Message, MessageType, MessageProps } from "./message.e"
import { Serial, SerialProps } from "./serial.vo"
import { Watch } from "./watch.agg"
import IWatchRepository from "./i_watch_repository"
import Either from "../core/either"
import { Maybe } from "../core/maybe"
import {
	ReadMessagesOfDTO,
	GetLocationOfDTO,
	build_get_location_of_dto,
	build_read_messages_of_dto,
} from "./watch_dtos"
import { UniqueId } from "../core/entity"

@injectable()
export class WatchService {
	private readonly watch_repo: IWatchRepository

	constructor(@inject("IWatchRepository") watch_repo: IWatchRepository) {
		this.watch_repo = watch_repo
	}

	async post_message(
		watch_props: { vendor: string; serial: string },
		message_props: MessageProps
	): Promise<Maybe<PostMessageFailure>> {
		let serial, message

		try {
			serial = Serial.create({ serial: watch_props.serial })
			message = Message.create(message_props)
		} catch (err) {
			return Maybe.some(new InvalidWatchDataFailure(err))
		}

		// Find the addressed watch
		const maybe_watch = await this.watch_repo.with_serial_and_vendor(
			serial,
			watch_props.serial
		)

		let watch: Watch

		if (maybe_watch.has_some()) watch = maybe_watch.get_val()
		else {
			// If it does not exist, create it
			try {
				watch = Watch.create({
					serial,
					vendor: watch_props.serial,
					messages: [],
				})
			} catch (err) {
				return Maybe.some(new InvalidWatchDataFailure(err))
			}

			watch.dispatch_event(new WatchCreated(watch.id))
		}

		// Post the message, then save the watch's state
		watch.post_message(message)

		this.watch_repo.save(watch)

		// Notify
		watch.dispatch_event(new MessagePosted(watch.id))

		if (message.type === MessageType.UD)
			watch.dispatch_event(new LocationUpdated(watch.id))

		return Maybe.none()
	}

	async read_messages_of(
		watch: UniqueId
	): Promise<Either<ReadMessagesOfFailure, ReadMessagesOfDTO>> {
		// Get the watch
		const maybe_watch = await this.watch_repo.with_id(watch)

		if (maybe_watch.is_none()) return Either.left(new InvalidWatchDataFailure())
		return Either.right(
			build_read_messages_of_dto(maybe_watch.get_val().messages)
		)
	}

	async get_location_of(
		watch: UniqueId
	): Promise<Either<GetLocationOfFailure, GetLocationOfDTO>> {
		// Get the watch
		const maybe_watch = await this.watch_repo.with_id(watch)

		if (maybe_watch.is_none()) return Either.left(new InvalidWatchDataFailure())

		const location_update = maybe_watch.get_val().location

		if (location_update === null)
			return Either.left(new NoLocationDataFailure())

		return Either.right(build_get_location_of_dto(location_update))
	}
}
