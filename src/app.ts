import "reflect-metadata"

import load from "./loaders"
import { DomainEventsDispatcher } from "./domain/core/domain_events"
import { AccountCreatedEvent } from "./domain/auth/account_created.de"
import express from "express"

const main = async () => {
	const app = express()

	await load(app)

	DomainEventsDispatcher.register_handler(AccountCreatedEvent.name, (event) =>
		console.log(event.aggregate_id)
	)
}

main()
