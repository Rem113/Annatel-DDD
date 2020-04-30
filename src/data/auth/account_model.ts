import { model, Schema, Document } from "mongoose"
import { DomainEventsDispatcher } from "../../domain/core/domain_events"
import { UniqueId } from "../../domain/core/entity"

export interface IAccountDocument extends Document {
	email: string
	password: string
}

const AccountSchema = new Schema({
	_id: String,
	email: String,
	password: String,
})

AccountSchema.post("save", (acc) =>
	DomainEventsDispatcher.dispatch_events_for_aggregate(new UniqueId(acc._id))
)

export const AccountModel = model<IAccountDocument>(
	"Account",
	AccountSchema,
	"Accounts"
)
