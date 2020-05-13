import IParentRepository from "../../domain/watch/i_parent_repository"
import { UniqueId } from "../../domain/core/entity"
import { Maybe } from "../../domain/core/maybe"
import { Parent } from "../../domain/watch/parent.agg"
import { injectable, inject } from "tsyringe"
import { IParentModel } from "./parent_model"
import { ParentMapper } from "./parent_mapper"

@injectable()
export class ParentRepository implements IParentRepository {
	private readonly parent_model: IParentModel

	constructor(@inject("IParentModel") parent_model: IParentModel) {
		this.parent_model = parent_model
	}

	async with_account(id: UniqueId): Promise<Maybe<Parent>> {
		const parent = await this.parent_model
			.findOne({ account: id.to_string() })
			.exec()

		if (parent) return Maybe.some(ParentMapper.from_persistance(parent))
		return Maybe.none()
	}
	async save(parent: Parent): Promise<void> {
		await this.parent_model.findByIdAndUpdate(
			parent.id.to_string(),
			ParentMapper.to_persistance(parent),
			{ new: true, upsert: true }
		)
	}
}
