import { LocationUpdate } from "./location_update.vo"
import { Message, MessageType } from "./message.e"

export interface IMessage {
	type: MessageType
	posted_at: Date
	payload: any
}

export interface ReadMessagesOfDTO {
	messages: IMessage[]
}

export const build_read_messages_of_dto = (
	messages: Message[]
): ReadMessagesOfDTO => ({
	messages: messages.map((message) => ({
		type: MessageType[(message.type as unknown) as keyof typeof MessageType],
		posted_at: message.posted_at,
		payload: message.payload,
	})),
})

export interface ILocationUpdate {
	latitude: number
	longitude: number
	last_update: Date
}

export interface GetLocationOfDTO {
	location: ILocationUpdate
}

export const build_get_location_of_dto = (
	location_update: LocationUpdate
): GetLocationOfDTO => ({
	location: {
		latitude: location_update.latitude,
		longitude: location_update.longitude,
		last_update: location_update.last_update,
	},
})
