import { model, Schema, Document, Model } from "mongoose"
import { DomainEventsDispatcher } from "../../domain/core/domain_events"
import { UniqueId } from "../../domain/core/entity"

export interface IAccountDocument extends Document {
	email: string
	password: string
	inserted_at?: Date
	updated_at?: Date
}

export type IAccountModel = Model<IAccountDocument>

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

AccountSchema.pre<IAccountDocument>("findOneAndUpdate", function () {
	this.updated_at = new Date()
})

AccountSchema.post<IAccountDocument>("findOneAndUpdate", (account) =>
	DomainEventsDispatcher.dispatch_events_for_aggregate(
		new UniqueId(account._id)
	)
)

export default model<IAccountDocument>("Account", AccountSchema, "Accounts")
