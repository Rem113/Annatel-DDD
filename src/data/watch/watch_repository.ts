import IWatchRepository from "../../domain/watch/i_watch_repository"
import { Serial } from "../../domain/watch/serial.vo"
import { Maybe } from "../../domain/core/maybe"
import { Watch } from "../../domain/watch/watch.agg"
import { injectable, inject } from "tsyringe"
import { IWatchModel } from "./watch_model"
import { WatchMapper } from "./watch_mapper"

@injectable()
export default class WatchRepository implements IWatchRepository {
	private readonly watch_model: IWatchModel

	constructor(@inject("IWatchModel") watch_model: IWatchModel) {
		this.watch_model = watch_model
	}

	async with_serial_and_vendor(
		serial: Serial,
		vendor: string
	): Promise<Maybe<Watch>> {
		const watch = await this.watch_model
			.findOne({ serial: serial.serial, vendor })
			.exec()

		if (watch) return Maybe.some(WatchMapper.from_persistance(watch))
		return Maybe.none()
	}

	async save(watch: Watch): Promise<void> {
		await this.watch_model.findByIdAndUpdate(
			watch.id.to_string(),
			WatchMapper.to_persistance(watch),
			{ new: true, upsert: true }
		)
	}
}
