import { Watch } from "./watch.agg"
import { Maybe } from "../core/maybe"
import { Serial } from "./serial.vo"

export default interface IWatchRepository {
	with_serial_and_vendor(serial: Serial, vendor: string): Promise<Maybe<Watch>>
	save(watch: Watch): Promise<void>
}
