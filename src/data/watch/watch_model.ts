import { model, Schema, Document, Model } from "mongoose"
import { DomainEventsDispatcher } from "../../domain/core/domain_events"
import { MessageType } from "../../domain/watch/message_vo"
import { UniqueId } from "../../domain/core/entity"

export interface IMessage {
	length: number
	type: MessageType
	payload?: any
}

export interface IWatchDocument extends Document {
	serial: string
	vendor: string
	messages: IMessage[]
	inserted_at?: Date
	updated_at?: Date
}

export type IWatchModel = Model<IWatchDocument>

const MessageSchema = new Schema(
	{
		posted_at: {
			type: Date,
			default: Date.now,
		},
		length: {
			type: Number,
			required: true,
		},
		type: {
			type: MessageType,
			required: true,
		},
		payload: {
			type: Object,
			default: {},
		},
	},
	{ _id: false }
)

const WatchSchema = new Schema({
	_id: {
		required: true,
		type: String,
	},
	serial: {
		required: true,
		type: String,
	},
	vendor: {
		required: true,
		type: String,
	},
	messages: [MessageSchema],
	inserted_at: {
		default: Date.now,
		type: Date,
	},
	updated_at: {
		default: Date.now,
		type: Date,
	},
})

WatchSchema.pre<IWatchDocument>("findOneAndUpdate", function () {
	this.updated_at = new Date()
})

WatchSchema.post<IWatchDocument>("findOneAndUpdate", (watch) =>
	DomainEventsDispatcher.dispatch_events_for_aggregate(new UniqueId(watch._id))
)

export default model<IWatchDocument>("Watch", WatchSchema, "Watches")
