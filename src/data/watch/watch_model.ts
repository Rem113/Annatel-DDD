import { model, Schema, Document } from "mongoose"
import { DomainEventsDispatcher } from "../../domain/core/domain_events"

export interface IWatchDocument extends Document {
	_id: string
	vendor: string
	inserted_at: Date
	updated_at: Date
}

const WatchSchema = new Schema({
	_id: {
		required: true,
		type: String,
		unique: true,
	},
	serial: {
		required: true,
		type: String,
	},
	vendor: {
		required: true,
		type: String,
	},
	insertedAt: {
		default: Date.now,
		type: Date,
	},
	updatedAt: {
		default: Date.now,
		type: Date,
	},
})

WatchSchema.post("save", (watch) =>
	DomainEventsDispatcher.dispatch_events_for_aggregate(watch._id)
)

export default model<IWatchDocument>("Watch", WatchSchema, "Watches")
