# Auth

## Account

### Fields

- Email
- Password

### Commands

- Register(Email, Password)

### Queries

- Login(Email, Password) -> Token

# Watch

## Watch

### Fields

- Vendor
- Serial
- Messages
  - Type
  - Length
  - Payload

### Commands

- PostMessage(Message)

### Queries

- ReadMessagesOf(Watch) -> Messages
- LocationOf(Watch) -> Location

## Parent

### Fields

- Account
- Subscriptions
  - Geofences
    - Day of week
    - From
    - To

### Commands

- SubscribeTo(Watch)
- UnsubscribeFrom(Watch)
- DefineGeofenceFor(Watch)

### Queries

- GeofencesFor(Watch) -> Geofences
- LinkedWatches() -> Watches
