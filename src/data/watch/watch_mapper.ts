import WatchModel, { IWatchDocument } from "./watch_model"
import { Watch } from "../../domain/watch/watch.agg"
import { UniqueId } from "../../domain/core/entity"
import { Serial } from "../../domain/watch/serial.vo"
import { Message } from "../../domain/watch/message_vo"

export class WatchMapper {
	static to_persistance(watch: Watch): IWatchDocument {
		return new WatchModel({
			_id: watch.id.to_string(),
			serial: watch.serial,
			vendor: watch.vendor,
			inserted_at: watch.inserted_at,
			updated_at: watch.updated_at,
			messages: watch.messages.map((message) => ({
				length: message.length,
				type: message.type,
				payload: message.payload,
			})),
		})
	}

	static from_persistance(document: IWatchDocument): Watch {
		const watch = {
			id: new UniqueId(document._id),
			serial: Serial.create({ serial: document.serial }).get_val(),
			vendor: document.vendor,
			messages: [
				...document.messages.map((message) =>
					Message.create({
						type: message.type,
						length: message.length,
						payload: message.payload,
					}).get_val()
				),
			],
			inserted_at: document.inserted_at,
			updated_at: document.updated_at,
		}

		return Watch.create(watch).get_val()
	}
}
