import { Watch } from "./watch.agg"
import { Maybe } from "../core/maybe"
import { Serial } from "./serial.vo"
import { UniqueId } from "../core/entity"

export default interface IWatchRepository {
	with_serial_and_vendor(serial: Serial, vendor: string): Promise<Maybe<Watch>>
	with_id(id: UniqueId): Promise<Maybe<Watch>>
	save(watch: Watch): Promise<void>
}
