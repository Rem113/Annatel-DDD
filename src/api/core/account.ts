import { UniqueId } from "../../domain/core/entity"

export default interface Account {
	id: UniqueId
	email: string
}
