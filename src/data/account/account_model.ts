import { model, Schema, Document } from "mongoose"
import { DomainEventsDispatcher } from "../../domain/core/domain_events"
import { UniqueId } from "../../domain/core/entity"

export interface IAccountDocument extends Document {
	email: string
	password: string
	inserted_at?: Date
	updated_at?: Date
}

const AccountSchema = new Schema({
	_id: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	inserted_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Date,
		default: Date.now,
	},
})

AccountSchema.post("save", (acc) =>
	DomainEventsDispatcher.dispatch_events_for_aggregate(new UniqueId(acc._id))
)

export const AccountModel = model<IAccountDocument>(
	"Account",
	AccountSchema,
	"Accounts"
)
