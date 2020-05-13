import { MessageType } from "./message.e"

export interface IMessage {
	type: MessageType
	posted_at: Date
	payload: any
}

export interface ReadMessagesOfDTO {
	messages: IMessage[]
}

export interface ILocationUpdate {
	latitude: number
	longitude: number
	last_update: Date
}

export interface GetLocationOfDTO {
	location: ILocationUpdate
}
