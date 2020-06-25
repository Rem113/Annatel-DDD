import Should from "../core/should"
import { EntityProps, Entity } from "../core/entity"

export enum MessageType {
  AL = "AL",
  ANY = "ANY",
  APN = "APN",
  BT = "BT",
  CALL = "CALL",
  CENTER = "CENTER",
  CR = "CR",
  FACTORY = "FACTORY",
  IP = "IP",
  LK = "LK",
  LOWBAT = "LOWBAT",
  LZ = "LZ",
  MONITOR = "MONITOR",
  POWEROFF = "POWEROFF",
  PULSE = "PULSE",
  PW = "PW",
  RAD = "RAD",
  REMOVE = "REMOVE",
  RESET = "RESET",
  RG = "RG",
  SLAVE = "SLAVE",
  SMS = "SMS",
  SOS = "SOS",
  SOS1 = "SOS1",
  SOS2 = "SOS2",
  SOS3 = "SOS3",
  SOSSMS = "SOSSMS",
  TS = "TS",
  UD = "UD",
  UD2 = "UD2",
  UPGRADE = "UPGRADE",
  UPLOAD = "UPLOAD",
  URL = "URL",
  VERNO = "VERNO",
  WAD = "WAD",
  WG = "WG",
  WORK = "WORK",
  WORKTIME = "WORKTIME",
}

export interface MessageProps extends EntityProps {
  type: MessageType
  length: number
  payload?: any
  posted_at: Date
}

export class Message extends Entity<MessageProps> {
  static create(props: MessageProps): Message {
    const error = Should.not_be_null_or_undefined([
      { name: "Type", value: props.type },
      { name: "Length", value: props.length },
    ])

    if (error.has_some()) throw error.get_val()

    if (!Object.values(MessageType).includes(props.type))
      throw "Please enter a valid message type"

    return new Message(props)
  }

  get length(): number {
    return this.props.length
  }

  get type(): MessageType {
    return this.props.type
  }

  get payload(): any {
    return this.props.payload ?? {}
  }

  get posted_at(): Date {
    return this.props.posted_at
  }
}
