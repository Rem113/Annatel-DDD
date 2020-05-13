import { Parent } from "./parent.agg"
import { UniqueId } from "../core/entity"
import { Maybe } from "../core/maybe"

export default interface IParentRepository {
	with_account(id: UniqueId): Promise<Maybe<Parent>>
	save(parent: Parent): Promise<void>
}
