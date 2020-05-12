import "reflect-metadata"
require("dotenv").config()

import load from "./config"
import { DomainEventsDispatcher } from "./domain/core/domain_events"
import express from "express"
import { AccountCreated, AccountLogin } from "./domain/account/account_events"
import {
	MessagePosted,
	WatchCreated,
	LocationUpdated,
} from "./domain/watch/watch_events"

const main = async () => {
	const app = express()

	await load(app)

	DomainEventsDispatcher.register_handler(AccountCreated.name, (event) =>
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
	DomainEventsDispatcher.register_handler(LocationUpdated.name, (event) =>
		console.log(event)
	)
}

main()
