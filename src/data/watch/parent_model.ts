import { Document, Model, Schema, model } from "mongoose"
import { DayOfWeek } from "../../domain/watch/time_frame.vo"
import { UniqueId } from "../../domain/core/entity"
import { DomainEventsDispatcher } from "../../domain/core/domain_events"

export interface ITimeFrame {
	day_of_week: DayOfWeek
	from: number
	to: number
}

export interface IGeofence {
	time_frames: ITimeFrame[]
	latitude: number
	longitude: number
	name: string
	notification: boolean
	radius: number
}

export interface ISubscriptionDocument extends Document {
	watch: string
	geofences: IGeofence[]
}

export interface IParentDocument extends Document {
	account: string
	subscriptions: ISubscriptionDocument[]
	inserted_at?: Date
	updated_at?: Date
}

export type IParentModel = Model<IParentDocument>

const TimeFrameSchema = new Schema(
	{
		day_of_week: {
			type: DayOfWeek,
			required: true,
		},
		from: {
			type: Number,
			required: true,
			min: 0,
			max: 2359,
		},
		to: {
			type: Number,
			required: true,
			min: 0,
			max: 2359,
		},
	},
	{ _id: false }
)

const GeofenceSchema = new Schema(
	{
		time_frames: [TimeFrameSchema],
		latitude: {
			max: 90.0,
			min: -90.0,
			required: true,
			type: Number,
		},
		longitude: {
			max: 180.0,
			min: -180.0,
			required: true,
			type: Number,
		},
		name: {
			required: true,
			type: String,
		},
		notification: {
			default: false,
			type: Boolean,
		},
		radius: {
			required: true,
			type: Number,
		},
	},
	{ _id: false }
)

const SubscriptionSchema = new Schema({
	_id: {
		required: true,
		type: String,
	},
	watch: {
		required: true,
		type: String,
		ref: "Watch",
	},
	geofences: [GeofenceSchema],
})

const ParentSchema = new Schema({
	_id: {
		required: true,
		type: String,
	},
	account: {
		required: true,
		type: String,
		ref: "Account",
	},
	subscriptions: [SubscriptionSchema],
	inserted_at: {
		default: Date.now,
		type: Date,
	},
	updated_at: {
		default: Date.now,
		type: Date,
	},
})

ParentSchema.pre<IParentDocument>("findOneAndUpdate", function () {
	this.update({ updated_at: Date.now() })
})

ParentSchema.post<IParentDocument>("findOneAndUpdate", (parent) =>
	DomainEventsDispatcher.dispatch_events_for_aggregate(new UniqueId(parent._id))
)

export default model<IParentDocument>("Parent", ParentSchema, "Parents")
