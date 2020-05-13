import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import Token from "../core/token"
import AccountModel from "../../data/account/account_model"
import { UniqueId } from "../../domain/core/entity"

export default async (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers

	if (!authorization?.startsWith("Bearer"))
		return res.status(401).end("Unauthorized")

	const token = authorization.substring("Bearer ".length)

	let decoded: Token
	try {
		decoded = jwt.verify(token, process.env.SECRET!) as Token
	} catch (_) {
		return res.status(401).end("Token expired")
	}

	const account = await AccountModel.findOne({ email: decoded.email }).exec()

	if (!account) return res.status(401).end("Unknown user")

	req.account = {
		id: new UniqueId(account.id),
		email: account.email,
	}

	next()
}
