import "reflect-metadata"
require("dotenv").config()

import load from "./config"
import { DomainEventsDispatcher } from "./domain/core/domain_events"
import express from "express"
import {
	AccountCreatedEvent,
	AccountLogin,
} from "./domain/account/account_events"
import { MessagePosted, WatchCreated } from "./domain/watch/watch_events"

const main = async () => {
	const app = express()

	await load(app)

	DomainEventsDispatcher.register_handler(AccountCreatedEvent.name, (event) =>
		console.log(event)
	)
	DomainEventsDispatcher.register_handler(AccountLogin.name, (event) =>
		console.log(event)
	)
	DomainEventsDispatcher.register_handler(MessagePosted.name, (event) =>
		console.log(event)
	)
	DomainEventsDispatcher.register_handler(WatchCreated.name, (event) =>
		console.log(event)
	)
}

main()
