import { ValueObjectProps, ValueObject } from "../core/value_object"
import Should from "../core/should"

export interface SerialProps extends ValueObjectProps {
  serial: string
}

export class Serial extends ValueObject<SerialProps> {
  static create(props: SerialProps): Serial {
    const error = Should.not_be_null_or_undefined([
      {
        name: "Serial",
        value: props.serial,
      },
    ])
    if (error.has_some()) throw error.get_val()

    return new Serial(props)
  }

  get serial(): string {
    return this.value.serial
  }
}
